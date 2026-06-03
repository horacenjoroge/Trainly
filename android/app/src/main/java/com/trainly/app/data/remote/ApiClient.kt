package com.trainly.app.data.remote
import com.trainly.app.BuildConfig
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class ApiClient @Inject constructor(
    private val ai: AuthInterceptor,
    private val tri: TokenRefreshInterceptor,
) {
    private val baseUrl get() = if (BuildConfig.DEBUG) "http://10.0.2.2:3000/" else "https://trainingapp-api-production.up.railway.app/"
    private val logging = HttpLoggingInterceptor().apply { level = if (BuildConfig.DEBUG) HttpLoggingInterceptor.Level.BODY else HttpLoggingInterceptor.Level.NONE }
    private val client = OkHttpClient.Builder()
        .addInterceptor(ai)
        .authenticator(tri)
        .addInterceptor(logging)
        .connectTimeout(30, TimeUnit.SECONDS)
        .readTimeout(30, TimeUnit.SECONDS)
        .writeTimeout(30, TimeUnit.SECONDS)
        .build()
    private val retrofit = Retrofit.Builder().baseUrl(baseUrl).client(client).addConverterFactory(GsonConverterFactory.create()).build()
    val authApi: AuthApi by lazy { retrofit.create(AuthApi::class.java) }
    val workoutApi: WorkoutApi by lazy { retrofit.create(WorkoutApi::class.java) }
    val postApi: PostApi by lazy { retrofit.create(PostApi::class.java) }
    val userApi: UserApi by lazy { retrofit.create(UserApi::class.java) }
    val contactApi: ContactApi by lazy { retrofit.create(ContactApi::class.java) }
    val achievementApi: AchievementApi by lazy { retrofit.create(AchievementApi::class.java) }
}
