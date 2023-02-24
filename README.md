# Supported Methods

#### Upload image uses body { file: File, format: string }

POST /api/images/upload

#### Upload image (Premium) uses body { file: File, format: string }

POST /api/images/premium-upload

#### Get image status by id

GET /api/images/status/:id

#### Download image by id

GET /api/images/download/:id

#### Buy credits uses body { credits: number }

POST /buy-credits
