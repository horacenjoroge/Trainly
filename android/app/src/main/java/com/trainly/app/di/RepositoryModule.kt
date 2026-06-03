package com.trainly.app.di

import com.trainly.app.data.repository.AuthRepositoryImpl
import com.trainly.app.data.repository.OfflineHomeRepository
import com.trainly.app.data.repository.StatsRepositoryImpl
import com.trainly.app.domain.repository.AuthRepository
import com.trainly.app.domain.repository.HomeRepository
import com.trainly.app.domain.repository.StatsRepository
import dagger.Binds
import dagger.Module
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
abstract class RepositoryModule {

    @Binds
    @Singleton
    abstract fun bindAuthRepository(
        authRepositoryImpl: AuthRepositoryImpl
    ): AuthRepository

    @Binds
    @Singleton
    abstract fun bindHomeRepository(
        offlineHomeRepository: OfflineHomeRepository
    ): HomeRepository

    @Binds
    @Singleton
    abstract fun bindStatsRepository(
        statsRepositoryImpl: StatsRepositoryImpl
    ): StatsRepository
}
