package com.trainly.app.data
import com.trainly.app.data.remote.ApiError
import com.trainly.app.data.remote.NetworkResult
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
class NetworkResultTest {
    @Test fun `Success holds data`() { val r=NetworkResult.Success("d"); assertTrue(r.isSuccess()); assertEquals("d",r.getOrNull()) }
    @Test fun `Error holds ApiError`() { val r=NetworkResult.Error(ApiError("fail")); assertFalse(r.isSuccess()); assertNull(r.getOrNull()) }
    @Test fun `map transforms`() { val r=NetworkResult.Success(42); assertEquals("42",(r.map{it.toString()} as NetworkResult.Success).data) }
    @Test fun `map preserves error`() { val r=NetworkResult.Error(ApiError("f")); assertTrue(r.map{} is NetworkResult.Error) }
    @Test fun `apiError helpers`() { assertTrue(ApiError.networkError().isNetworkError); assertTrue(ApiError.authError().isAuthError); assertEquals(500, ApiError.serverError(500).statusCode) }
}
