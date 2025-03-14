<?php
// Headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Include files
include_once '../../config/Database.php';
include_once '../../models/User.php';

// Get database connection
$database = new Database();
$db = $database->getConnection();

// Initialize user object
$user = new User($db);

// Get posted data
$data = json_decode(file_get_contents("php://input"));

// Set properties
$user->email = $data->email;
$email_exists = $user->login();

if($email_exists->rowCount() > 0) {
    $row = $email_exists->fetch(PDO::FETCH_ASSOC);
    
    if(password_verify($data->password, $row['password'])) {
        http_response_code(200);
        echo json_encode(
            array(
                "message" => "Login successful.",
                "id" => $row['id'],
                "name" => $row['name']
            )
        );
    } else {
        http_response_code(401);
        echo json_encode(array("message" => "Login failed."));
    }
} else {
    http_response_code(401);
    echo json_encode(array("message" => "Login failed."));
}
?>
