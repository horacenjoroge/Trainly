package com.trainly.app.di

import android.content.Context
import com.trainly.app.data.local.room.AppDatabase
import com.trainly.app.data.local.room.PostDao
import com.trainly.app.data.local.room.UserCacheDao
import com.trainly.app.data.local.room.WorkoutDao
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object DatabaseModule {

    @Provides
    @Singleton
    fun provideDatabase(@ApplicationContext ctx: Context): AppDatabase {
        return AppDatabase.create(ctx)
    }

    @Provides
    fun provideWorkoutDao(db: AppDatabase): WorkoutDao = db.workoutDao()

    @Provides
    fun providePostDao(db: AppDatabase): PostDao = db.postDao()

    @Provides
    fun provideUserCacheDao(db: AppDatabase): UserCacheDao = db.userCacheDao()
}
