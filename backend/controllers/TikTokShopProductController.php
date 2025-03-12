<?php
require_once 'Controller.php';
require_once __DIR__ . '/../utils/TikTokShopAPI.php';

class TikTokProductController extends Controller {
    private $tiktokAPI;

    public function __construct($db, $requestMethod, $id = null) {
        parent::__construct($db, $requestMethod, $id);
        $this->tiktokAPI = new TikTokShopAPI(
            '6fhag6sdtcssb',
            '47fe5e03b778eaddee91c3b97e6db8199c7b7037',
            'YOUR_ACCESS_TOKEN'
        );
    }

    public function processRequest() {
        switch ($this->requestMethod) {
            case 'GET':
                $response = $this->getTikTokProducts();
                break;
            default:
                $response = $this->notFoundResponse();
                break;
        }
        
        $this->sendResponse($response['data'], $response['status']);
    }

    private function getTikTokProducts() {
        try {
            $products = $this->tiktokAPI->getProducts([
                'page_size' => 20,
                'page_number' => $_GET['page'] ?? 1
            ]);

            return [
                'status' => 200,
                'data' => $products
            ];
        } catch (Exception $e) {
            return [
                'status' => 500,
                'data' => ['error' => $e->getMessage()]
            ];
        }
    }
}
?>
