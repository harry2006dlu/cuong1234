<?php
require_once 'Controller.php';
require_once __DIR__ . '/../models/Product.php';

class ProductController extends Controller {
    private $product;

    public function __construct($db, $requestMethod, $id = null) {
        parent::__construct($db, $requestMethod, $id);
        $this->product = new Product($db);
    }

    public function processRequest() {
        switch ($this->requestMethod) {
            case 'GET':
                if ($this->id) {
                    $response = $this->getProduct($this->id);
                } else {
                    $response = $this->getAllProducts();
                }
                break;
            case 'POST':
                $response = $this->createProduct();
                break;
            case 'PUT':
                $response = $this->updateProduct($this->id);
                break;
            case 'DELETE':
                $response = $this->deleteProduct($this->id);
                break;
            default:
                $response = $this->notFoundResponse();
                break;
        }
        
        $this->sendResponse($response['data'], $response['status']);
    }

    private function getAllProducts() {
        $result = $this->product->read();
        $products = [];

        while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
            array_push($products, $row);
        }

        return [
            'status' => 200,
            'data' => ['products' => $products]
        ];
    }

    private function getProduct($id) {
        $result = $this->product->readOne($id);
        
        if ($result) {
            return [
                'status' => 200,
                'data' => $result
            ];
        }
        
        return $this->notFoundResponse();
    }

    private function createProduct() {
        $input = $this->getPostData();
        $required_fields = ['name', 'price', 'description', 'category'];

        if (!$this->validateRequest($required_fields, $input)) {
            return [
                'status' => 400,
                'data' => ['error' => 'Missing required fields']
            ];
        }

        $this->product->name = $input['name'];
        $this->product->price = $input['price'];
        $this->product->description = $input['description'];
        $this->product->category = $input['category'];
        $this->product->image = $input['image'] ?? null;

        if ($this->product->create()) {
            return [
                'status' => 201,
                'data' => ['message' => 'Product created successfully']
            ];
        }

        return [
            'status' => 500,
            'data' => ['error' => 'Failed to create product']
        ];
    }

    private function updateProduct($id) {
        $input = $this->getPostData();
        $this->product->id = $id;

        if ($this->product->update($input)) {
            return [
                'status' => 200,
                'data' => ['message' => 'Product updated successfully']
            ];
        }

        return [
            'status' => 500,
            'data' => ['error' => 'Failed to update product']
        ];
    }

    private function deleteProduct($id) {
        $this->product->id = $id;
        
        if ($this->product->delete()) {
            return [
                'status' => 200,
                'data' => ['message' => 'Product deleted successfully']
            ];
        }

        return [
            'status' => 500,
            'data' => ['error' => 'Failed to delete product']
        ];
    }

    private function notFoundResponse() {
        return [
            'status' => 404,
            'data' => ['error' => 'Resource not found']
        ];
    }
}
?>
