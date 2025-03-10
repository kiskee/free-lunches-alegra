# Food Ordering System - Microservices Architecture

## Overview

This project implements a comprehensive food ordering system using a microservices architecture built with pure Node.js. The system models the complete order lifecycle from restaurant order creation through kitchen processing, warehouse inventory management, market purchases, and final order fulfillment.

Each microservice communicates asynchronously via Kafka messaging, stores data in MongoDB, and publishes real-time updates through WebSockets to the React frontend. This event-driven architecture ensures loose coupling between services while maintaining data consistency and providing real-time updates to users.

![Architecture Diagram](https://github.com/kiskee/free-lunches-alegra/blob/main/Diagram.png)

## System Components

### Microservices

1. **Restaurant Service**
   - Entry point for new food orders
   - Publishes order events to Kafka
   - Stores order data in MongoDB
   - Broadcasts order events to WebSocket for frontend consumption
   - Receives and processes finalized order notifications from the Kitchen

2. **Kitchen Service**
   - Consumes new order messages from Restaurant
   - Requests ingredients from Warehouse
   - Processes orders when ingredients are available
   - Sends finalized order notifications back to Restaurant

3. **Warehouse Service**
   - Manages inventory of ingredients
   - Validates ingredient availability
   - Initiates market purchases when ingredients are unavailable
   - Publishes inventory status updates to WebSocket
   - Fulfills ingredient requests to Kitchen

4. **Market Service**
   - Receives purchase requests from Warehouse
   - Simulates external vendor interactions
   - Provides ingredients back to Warehouse

### Technical Stack

- **Backend**: Pure Node.js
- **Message Broker**: Apache Kafka
- **Database**: MongoDB
- **Real-time Communication**: WebSockets
- **Frontend**: React
- **Testing**: Jest
- **Infrastructure**: Docker, AWS
- **CI/CD**: GitHub Actions (or similar)

## Event Flow

### Order Creation Process
1. Restaurant creates a new order
2. Order data is saved in MongoDB
3. Order event is published to Kafka
4. WebSocket broadcasts order creation to frontend

### Kitchen Processing
1. Kitchen consumes new order message
2. Kitchen requests ingredients from Warehouse
3. Kitchen awaits ingredient fulfillment

### Warehouse Inventory Management
1. Warehouse receives ingredient request from Kitchen
2. Warehouse validates current inventory
3. Inventory status is published to WebSocket
4. If ingredients are available, they are sent to the Kitchen
5. If ingredients are unavailable, Warehouse initiates a market purchase

### Market Purchasing
1. Market receives purchase request from Warehouse
2. Market processes the purchase
3. Market sends ingredients back to Warehouse
4. Warehouse updates inventory and notifies WebSocket
5. Warehouse forwards ingredients to Kitchen

### Order Finalization
1. Kitchen prepares the order with all ingredients
2. Kitchen sends "order prepared" message to Restaurant via Kafka
3. Restaurant marks order as finalized in MongoDB
4. Restaurant publishes order finalization event to WebSocket
5. Frontend receives and displays order completion

## Installation and Setup

### Prerequisites
- Node.js (v14 or higher)
- Docker and Docker Compose
- Kafka
- MongoDB

### Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/kiskee/free-lunches-alegra.git
   cd food-ordering-system
   ```

2. Install dependencies for all services:
   ```bash
   npm run install-all
   ```

3. Configure environment variables:
   - Copy `.env.example` to `.env` in each service directory
   - Update configuration values as needed

4. Start infrastructure services:
   ```bash
   docker-compose up -d
   ```

5. Start all microservices:
   ```bash
   npm run start-all
   ```

## Service Details

### Restaurant Service

**Responsibilities:**
- Create and manage orders
- Persist order data in MongoDB
- Publish order events to Kafka topic `restaurant-orders`
- Send real-time updates via WebSockets
- Process finalized orders from Kitchen

**API Endpoints:**
- `POST /api/orders` - Create a new order
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get order by ID
- `PUT /api/orders/:id/status` - Update order status

### Kitchen Service

**Responsibilities:**
- Process incoming orders from Restaurant
- Request ingredients from Warehouse
- Prepare orders when all ingredients are available
- Notify Restaurant of completed orders

**Kafka Topics:**
- Consumes: `restaurant-orders`
- Produces: `kitchen-ingredient-requests`, `kitchen-order-completed`

### Warehouse Service

**Responsibilities:**
- Maintain inventory of ingredients
- Process ingredient requests from Kitchen
- Order missing ingredients from Market
- Update inventory levels
- Publish inventory status via WebSockets

**Kafka Topics:**
- Consumes: `kitchen-ingredient-requests`, `market-fulfillment`
- Produces: `warehouse-inventory-status`, `market-purchase-requests`

### Market Service

**Responsibilities:**
- Receive purchase requests from Warehouse
- Process external purchases
- Deliver ingredients back to Warehouse

**Kafka Topics:**
- Consumes: `market-purchase-requests`
- Produces: `market-fulfillment`

## WebSocket Events

The system publishes the following real-time events:

| Event Type | Description | Data |
|------------|-------------|------|
| `order_created` | New order created in Restaurant | Order details |
| `order_in_progress` | Kitchen processing order | Order ID, status |
| `inventory_status` | Current warehouse inventory | Ingredient levels |
| `market_purchase` | Market purchase initiated | Items being purchased |
| `order_ready` | Order preparation completed | Order ID, status |
| `order_finalized` | Order cycle completed | Order details |

# Important testing results:
## Performance Testing

The system has undergone stress testing to evaluate its performance under load. Below are the results from recent tests using Artillery.io.

### Test Configuration
- Test duration: 32 seconds
- Total virtual users: 1,800
- Average request rate: 61 requests/second

### Summary Results

#### HTTP Performance
- **Total requests**: 1,800
- **Success rate**: 100% (1,800 successful responses, 0 failures)
- **Total downloaded bytes**: 178,200

#### Response Time
- **Minimum**: 79ms
- **Maximum**: 303ms
- **Mean**: 106.9ms
- **Median**: 102.5ms
- **95th percentile**: 138.4ms
- **99th percentile**: 237.5ms

#### Virtual User Session Length
- **Minimum**: 155.6ms
- **Maximum**: 429.2ms
- **Mean**: 202.9ms
- **Median**: 194.4ms
- **95th percentile**: 278.7ms
- **99th percentile**: 376.2ms

### Period Breakdown

| Period | Request Rate | Avg Response Time | 95th Percentile | 99th Percentile |
|--------|--------------|-------------------|-----------------|-----------------|
| Period 1 | 57/sec | 97.1ms | 106.7ms | 111.1ms |
| Period 2 | 54/sec | 103.1ms | 127.8ms | 179.5ms |
| Period 3 | 62/sec | 105.4ms | 135.7ms | 179.5ms |
| Period 4 | 68/sec | 113.0ms | 156.0ms | 257.3ms |

### Analysis

The test results demonstrate that the system handles load effectively with:

- Consistent response times (average ~107ms) even as the request rate increases
- No failed requests throughout the test
- Minimal variation between mean and median response times, indicating stable performance
- 99% of all requests were served in under 240ms

These metrics suggest the microservices architecture is performing well under normal load conditions. The system shows linear scalability characteristics with only a slight increase in response time (from 97ms to 113ms) as the request rate increased from 57/sec to 68/sec.

### Testing Tools

- **Artillery.io**: Used for load generation and metrics collection
- **Test script**: `load-test.yml` (available in the `/tests/performance` directory)

To replicate these performance tests, run:

```bash
npm run test:performance
```

## Development

### Running Services Individually

Each microservice can be run independently:

```bash
cd services/restaurant
npm start

cd services/kitchen
npm start

cd services/warehouse
npm start

cd services/market
npm start
```

### Testing

Run tests for all services:

```bash
npm run test-all
```

Or for specific services:

```bash
cd services/restaurant
npm test
```

## Deployment

The system is designed to be deployed using Docker containers and can be orchestrated with Kubernetes or managed directly in AWS.

### Docker Deployment

Build and run all services:

```bash
docker-compose build
docker-compose up -d
```

### AWS Deployment

The infrastructure is provisioned using AWS services:
- EC2 or ECS for service containers
- MSK for Kafka
- DocumentDB for MongoDB
- Elastic Load Balancer for API gateway

## Future Enhancements

1. Implement authentication and authorization
2. Add payment processing service
3. Implement delivery tracking
4. Add analytics dashboard
5. Implement circuit breakers for resilience
6. Add rate limiting and service throttling

## First approach

This was my initial idea
![Architecture Diagram](https://github.com/kiskee/free-lunches-alegra/blob/main/firstLook.jpeg)


## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

[MIT](LICENSE)