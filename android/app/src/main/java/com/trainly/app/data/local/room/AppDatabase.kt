package com.trainly.app.data.local.room
import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase

@Database(entities = [WorkoutEntity::class, PostEntity::class, UserCacheEntity::class], version = 1, exportSchema = false)
abstract class AppDatabase : RoomDatabase() {
    abstract fun workoutDao(): WorkoutDao; abstract fun postDao(): PostDao; abstract fun userCacheDao(): UserCacheDao
    companion object {
        fun create(ctx: Context) = Room.databaseBuilder(ctx.applicationContext, AppDatabase::class.java, "trainly_db").build()
    }
}
