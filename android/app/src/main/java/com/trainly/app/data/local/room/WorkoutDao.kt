package com.trainly.app.data.local.room
import androidx.room.*
import kotlinx.coroutines.flow.Flow

@Dao
interface WorkoutDao {
    @Query("SELECT * FROM workouts ORDER BY createdAt DESC") fun getAll(): Flow<List<WorkoutEntity>>
    @Query("SELECT * FROM workouts WHERE id=:id") suspend fun getById(id: String): WorkoutEntity?
    @Insert(onConflict = OnConflictStrategy.REPLACE) suspend fun insertAll(w: List<WorkoutEntity>)
    @Insert(onConflict = OnConflictStrategy.REPLACE) suspend fun insert(w: WorkoutEntity)
    @Query("DELETE FROM workouts") suspend fun deleteAll()
}
@Dao
interface PostDao {
    @Query("SELECT * FROM posts ORDER BY createdAt DESC") fun getAll(): Flow<List<PostEntity>>
    @Insert(onConflict = OnConflictStrategy.REPLACE) suspend fun insertAll(p: List<PostEntity>)
    @Query("DELETE FROM posts") suspend fun deleteAll()
}
@Dao
interface UserCacheDao {
    @Query("SELECT * FROM user_cache WHERE id=:id") suspend fun getUser(id: String): UserCacheEntity?
    @Insert(onConflict = OnConflictStrategy.REPLACE) suspend fun insert(u: UserCacheEntity)
}
