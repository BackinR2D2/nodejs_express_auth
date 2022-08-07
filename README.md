# Authentication

## - **POST /api/auth/register**
Request Body: {
    username: String | Required | MAX (25),
    password: String | Required | MAX (25),
    createAccountCode: String | Required / (Special code for administrators)
}
Response: {
    201: User created,
    400: Invalid Data,
    500: Server Error
}

## - **POST /api/auth/login**
Request Body: {
    username: String | Required | MAX (25),
    password: String | Required | MAX (25) | MIN (8)
}        
Response: {
    200: User authenticated 
    400: Invalid Data,
    404: User not found,
    500: Server Error
}

# User Management

## - **GET /api/user**
Request Body: {}
Request Cookie: {
    token: JWT Token with user's ID
}
Response Body: {
    200: JSON Object with the user's data,
    404: User not found,
    500: Server Error
}

## - **PUT /api/user/username**
Request Body: {
    newUsername: String | Required | MAX (25)
}
Request Cookie: {
    token: JWT Token with user's ID
}
Response Body: {
    201: New Username updated succesfully,
    400: Invalid Data,
    500: Server Error
}

## - **PUT /api/user/password**
Request Body: {
    newPassword: String | Required | MAX (25) | MIN (8)
}
Request Cookie: {
    token: JWT Token with user's ID
}
Response Body: {
    201: New Password updated succesfully,
    400: Invalid Data,
    500: Server Error
}

## - **DELETE /api/user**
Request Body: {}
Request Cookie: {
    token: JWT Token with user's ID
}
Response Body: {
    200: User deleted succesfully,
    500: Server Error
}
