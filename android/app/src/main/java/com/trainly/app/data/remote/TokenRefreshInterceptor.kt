package com.trainly.app.data.remote
import com.trainly.app.data.local.TokenManager
import com.trainly.app.data.remote.dto.RefreshTokenRequest
import kotlinx.coroutines.runBlocking
import okhttp3.Authenticator
import okhttp3.Request
import okhttp3.Response
import okhttp3.Route
import javax.inject.Inject

class TokenRefreshInterceptor @Inject constructor(
    private val tm: TokenManager, private val ac: dagger.Lazy<ApiClient>
) : Authenticator {
    override fun authenticate(route: Route?, response: Response): Request? = runBlocking {
        val rt = tm.getRefreshToken() ?: return@runBlocking null
        try {
            val r = ac.get().authApi.refreshToken(RefreshTokenRequest(rt))
            tm.saveAccessToken(r.body()?.token ?: return@runBlocking null)
            r.body()?.refreshToken?.let { tm.saveRefreshToken(it) }
            response.request.newBuilder().header("x-auth-token", r.body()?.token).build()
        } catch (_: Exception) { tm.clearAll(); null }
    }
}
