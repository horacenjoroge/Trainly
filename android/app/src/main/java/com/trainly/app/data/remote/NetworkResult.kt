package com.trainly.app.data.remote
sealed class NetworkResult<out T> {
    data class Success<T>(val data: T) : NetworkResult<T>()
    data class Error(val error: ApiError) : NetworkResult<Nothing>()
    data object Loading : NetworkResult<Nothing>()
}
fun <T> NetworkResult<T>.getOrNull(): T? = (this as? NetworkResult.Success)?.data
fun <T> NetworkResult<T>.isSuccess(): Boolean = this is NetworkResult.Success
