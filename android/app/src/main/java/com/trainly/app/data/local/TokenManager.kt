package com.trainly.app.data.local
import android.content.Context
import android.content.SharedPreferences
import androidx.security.crypto.EncryptedSharedPreferences
import androidx.security.crypto.MasterKey
import dagger.hilt.android.qualifiers.ApplicationContext
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class TokenManager @Inject constructor(@ApplicationContext ctx: Context) {
    private val mk = MasterKey.Builder(ctx).setKeyScheme(MasterKey.KeyScheme.AES256_GCM).build()
    private val prefs: SharedPreferences = EncryptedSharedPreferences.create(ctx, "trainly_secure", mk,
        EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV, EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM)
    suspend fun saveAccessToken(t: String) { prefs.edit().putString("access_token", t).apply() }
    suspend fun getAccessToken(): String? = prefs.getString("access_token", null)
    suspend fun saveRefreshToken(t: String) { prefs.edit().putString("refresh_token", t).apply() }
    suspend fun getRefreshToken(): String? = prefs.getString("refresh_token", null)
    suspend fun saveUserData(j: String) { prefs.edit().putString("user_data", j).apply() }
    suspend fun getUserData(): String? = prefs.getString("user_data", null)
    suspend fun hasValidToken(): Boolean = getAccessToken() != null
    suspend fun clearAll() { prefs.edit().clear().apply() }
}
