package com.trainly.app.data.remote
import com.trainly.app.data.local.TokenManager
import kotlinx.coroutines.runBlocking
import okhttp3.Interceptor
import okhttp3.Response
import javax.inject.Inject

class AuthInterceptor @Inject constructor(private val tm: TokenManager) : Interceptor {
    override fun intercept(chain: Interceptor.Chain): Response {
        val token = runBlocking { tm.getAccessToken() }
        if (token.isNullOrBlank()) return chain.proceed(chain.request())
        return chain.proceed(chain.request().newBuilder().header("x-auth-token", token).build())
    }
}
