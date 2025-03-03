<?php
class Controller {
    protected $db;
    protected $requestMethod;
    protected $id;

    public function __construct($db, $requestMethod, $id = null) {
        $this->db = $db;
        $this->requestMethod = $requestMethod;
        $this->id = $id;
    }

    protected function sendResponse($data, $statusCode = 200) {
        header('Content-Type: application/json');
        http_response_code($statusCode);
        echo json_encode($data);
    }

    protected function getPostData() {
        return json_decode(file_get_contents('php://input'), true);
    }

    protected function validateRequest($required_fields, $data) {
        foreach ($required_fields as $field) {
            if (!isset($data[$field]) || empty($data[$field])) {
                return false;
            }
        }
        return true;
    }
}
?>
