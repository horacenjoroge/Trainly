package com.trainly.app.data.remote
import com.trainly.app.data.remote.dto.*
import retrofit2.Response
import retrofit2.http.*

interface ContactApi {
    @GET("api/contacts") suspend fun getContacts(): Response<List<ContactDto>>
    @POST("api/contacts") suspend fun addContact(@Body c: ContactDto): Response<ContactDto>
    @PUT("api/contacts/{id}") suspend fun updateContact(@Path("id") id: String, @Body c: ContactDto): Response<ContactDto>
    @DELETE("api/contacts/{id}") suspend fun deleteContact(@Path("id") id: String): Response<Unit>
    @POST("api/contacts/send-sos") suspend fun sendSos(@Body r: SosRequest): Response<Unit>
}
