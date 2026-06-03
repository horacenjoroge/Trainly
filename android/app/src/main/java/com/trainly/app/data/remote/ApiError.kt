package com.trainly.app.data.remote
data class ApiError(val message: String, val statusCode: Int = 0, val errorBody: String? = null, val isNetworkError: Boolean = false, val isAuthError: Boolean = false) {
    companion object {
        fun networkError(m: String = "Network error"): ApiError = ApiError(m, isNetworkError = true)
        fun authError(m: String = "Auth required"): ApiError = ApiError(m, isAuthError = true, statusCode = 401)
        fun serverError(c: Int, m: String = "Server error"): ApiError = ApiError(m, statusCode = c)
    }
}
