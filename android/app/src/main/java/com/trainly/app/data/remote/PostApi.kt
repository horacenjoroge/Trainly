package com.trainly.app.data.remote
import com.trainly.app.data.remote.dto.*
import retrofit2.Response
import retrofit2.http.*

interface PostApi {
    @GET("api/posts") suspend fun getPosts(): Response<List<PostDto>>
    @POST("api/posts") suspend fun createPost(@Body r: CreatePostRequest): Response<PostDto>
    @PUT("api/posts/{id}/like") suspend fun likePost(@Path("id") id: String): Response<PostDto>
    @POST("api/posts/{id}/comments") suspend fun addComment(@Path("id") id: String, @Body r: CreateCommentRequest): Response<CommentDto>
    @GET("api/posts/{id}/comments") suspend fun getComments(@Path("id") id: String): Response<List<CommentDto>>
}
