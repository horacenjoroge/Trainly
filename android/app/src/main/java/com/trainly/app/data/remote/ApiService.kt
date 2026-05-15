package com.trainly.app.data.remote

import com.google.gson.Gson
import com.trainly.app.data.remote.dto.*
import java.io.IOException
import java.net.ConnectException
import java.net.SocketTimeoutException
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class ApiService @Inject constructor(private val ac: ApiClient) {
    private val gson = Gson()

    private suspend fun <T> call(api: suspend () -> retrofit2.Response<T>): NetworkResult<T> {
        return try {
            val r = api()
            if (r.isSuccessful) {
                r.body()?.let { NetworkResult.Success(it) }
                    ?: NetworkResult.Error(ApiError("Empty body", r.code()))
            } else {
                val errorMsg = try {
                    gson.fromJson(r.errorBody()?.string(), Map::class.java)?.get("message") as? String
                } catch (_: Exception) { null }
                NetworkResult.Error(ApiError(errorMsg ?: "Error", r.code()))
            }
        } catch (e: SocketTimeoutException) {
            NetworkResult.Error(ApiError.networkError("Timeout"))
        } catch (e: ConnectException) {
            NetworkResult.Error(ApiError.networkError("No connection"))
        } catch (e: IOException) {
            NetworkResult.Error(ApiError.networkError(e.message ?: "Network error"))
        } catch (e: Exception) {
            NetworkResult.Error(ApiError("Unknown error: ${e.message}"))
        }
    }

    suspend fun login(r: LoginRequest) = call { ac.authApi.login(r) }
    suspend fun register(r: RegisterRequest) = call { ac.authApi.register(r) }
    suspend fun refreshToken(r: RefreshTokenRequest) = call { ac.authApi.refreshToken(r) }
    suspend fun getCurrentUser() = call { ac.authApi.getCurrentUser() }
    suspend fun getWorkouts(p: Map<String, String> = emptyMap()) = call { ac.workoutApi.getWorkouts(p) }
    suspend fun getWorkout(id: String) = call { ac.workoutApi.getWorkout(id) }
    suspend fun createWorkout(d: WorkoutDto) = call { ac.workoutApi.createWorkout(d) }
    suspend fun getWorkoutStats(p: String = "month") = call { ac.workoutApi.getWorkoutStats(p) }
    suspend fun getPublicWorkouts(p: Map<String, String> = emptyMap()) = call { ac.workoutApi.getPublicWorkouts(p) }
    suspend fun toggleWorkoutLike(id: String) = call { ac.workoutApi.toggleLike(id) }
    suspend fun getPosts() = call { ac.postApi.getPosts() }
    suspend fun createPost(r: CreatePostRequest) = call { ac.postApi.createPost(r) }
    suspend fun likePost(id: String) = call { ac.postApi.likePost(id) }
    suspend fun addPostComment(id: String, t: String) = call { ac.postApi.addComment(id, CreateCommentRequest(t)) }
    suspend fun getPostComments(id: String) = call { ac.postApi.getComments(id) }
    suspend fun getUserProfile() = call { ac.userApi.getUserProfile() }
    suspend fun updateUserProfile(d: Map<String, Any>) = call { ac.userApi.updateUserProfile(d) }
    suspend fun getUserById(id: String) = call { ac.userApi.getUserById(id) }
    suspend fun searchUsers(q: String) = call { ac.userApi.searchUsers(q) }
    suspend fun getFollowers(id: String? = null) = call { ac.userApi.getFollowers(id) }
    suspend fun getFollowing(id: String? = null) = call { ac.userApi.getFollowing(id) }
    suspend fun followUser(id: String) = call { ac.userApi.followUser(id) }
    suspend fun unfollowUser(id: String) = call { ac.userApi.unfollowUser(id) }
    suspend fun getContacts() = call { ac.contactApi.getContacts() }
    suspend fun addContact(c: ContactDto) = call { ac.contactApi.addContact(c) }
    suspend fun updateContact(id: String, c: ContactDto) = call { ac.contactApi.updateContact(id, c) }
    suspend fun deleteContact(id: String) = call { ac.contactApi.deleteContact(id) }
    suspend fun sendSos(r: SosRequest) = call { ac.contactApi.sendSos(r) }
    suspend fun getUserAchievements() = call { ac.achievementApi.getUserAchievements() }
    suspend fun getAchievementProgress() = call { ac.achievementApi.getAchievementProgress() }
    suspend fun updateUserStats(d: Map<String, Any>) = call { ac.userApi.updateUserStats(d) }
}
