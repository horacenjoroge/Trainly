package com.trainly.app.di

import com.google.gson.Gson
import com.google.gson.GsonBuilder
import com.trainly.app.data.local.TokenManager
import com.trainly.app.data.remote.ApiClient
import com.trainly.app.data.remote.ApiService
import com.trainly.app.data.remote.AuthInterceptor
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object NetworkModule {

    @Provides
    @Singleton
    fun provideGson(): Gson {
        return GsonBuilder()
            .setDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
            .create()
    }

    @Provides
    @Singleton
    fun provideAuthInterceptor(tm: TokenManager): AuthInterceptor {
        return AuthInterceptor(tm)
    }

    @Provides
    @Singleton
    fun provideApiClient(ai: AuthInterceptor): ApiClient {
        return ApiClient(ai)
    }

    @Provides
    @Singleton
    fun provideApiService(ac: ApiClient): ApiService {
        return ApiService(ac)
    }
}
