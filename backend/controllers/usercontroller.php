<?php
require_once 'Controller.php';
require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../utils/JWTHandler.php';

class UserController extends Controller {
    private $user;
    private $jwtHandler;

    public function __construct($db, $requestMethod, $id = null) {
        parent::__construct($db, $requestMethod, $id);
        $this->user = new User($db);
        $this->jwtHandler = new JWTHandler();
    }

    public function processRequest() {
        switch ($this->requestMethod) {
            case 'POST':
                if (isset($_GET['action'])) {
                    switch ($_GET['action']) {
                        case 'login':
                            $response = $this->loginUser();
                            break;
                        case 'register':
                            $response = $this->registerUser();
                            break;
                        default:
                            $response = $this->notFoundResponse();
                    }
                } else {
                    $response = $this->notFoundResponse();
                }
                break;
            case 'GET':
                $response = $this->getUser($this->id);
                break;
            default:
                $response = $this->notFoundResponse();
                break;
        }
        
        $this->sendResponse($response['data'], $response['status']);
    }

    private function loginUser() {
        $input = $this->getPostData();
        
        if (!isset($input['email']) || !isset($input['password'])) {
            return [
                'status' => 400,
                'data' => ['error' => 'Email and password are required']
            ];
        }

        $result = $this->user->login($input['email'], $input['password']);
        
        if ($result) {
            $token = $this->jwtHandler->generateToken([
                'user_id' => $result['id'],
                'email' => $result['email']
            ]);

            return [
                'status' => 200,
                'data' => [
                    'token' => $token,
                    'user' => [
                        'id' => $result['id'],
                        'name' => $result['name'],
                        'email' => $result['email']
                    ]
                ]
            ];
        }

        return [
            'status' => 401,
            'data' => ['error' => 'Invalid credentials']
        ];
    }

    private function registerUser() {
        $input = $this->getPostData();
        $required_fields = ['name', 'email', 'password'];

        if (!$this->validateRequest($required_fields, $input)) {
            return [
                'status' => 400,
                'data' => ['error' => 'Missing required fields']
            ];
        }

        if ($this->user->emailExists($input['email'])) {
            return [
                'status' => 400,
                'data' => ['error' => 'Email already exists']
            ];
        }

        if ($this->user->create($input)) {
            return [
                'status' => 201,
                'data' => ['message' => 'User created successfully']
            ];
        }

        return [
            'status' => 500,
            'data' => ['error' => 'Failed to create user']
        ];
    }

    private function getUser($id) {
        $result = $this->user->readOne($id);
        
        if ($result) {
            unset($result['password']); // Remove sensitive data
            return [
                'status' => 200,
                'data' => $result
            ];
        }
        
        return $this->notFoundResponse();
    }
}
?>
