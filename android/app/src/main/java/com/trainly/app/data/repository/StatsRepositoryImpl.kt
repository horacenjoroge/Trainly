package com.trainly.app.data.repository
import com.trainly.app.data.remote.*
import com.trainly.app.domain.models.*
import com.trainly.app.domain.repository.*
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class StatsRepositoryImpl @Inject constructor(private val api: ApiService) : StatsRepository {
    override suspend fun getStats(period: String): NetworkResult<ProgressStats> = when (val r=api.getWorkoutStats(period)) {
        is NetworkResult.Success -> { val d=r.data; NetworkResult.Success(ProgressStats(totalWorkouts=d.totalWorkouts?:0, totalDistance=d.totalDistance?:0.0, totalDuration=d.totalDuration?:0, totalCalories=d.totalCalories?:0, averagePace=d.averagePace?:0.0, weeklyStats=d.weeklyStats?.map{WeeklyStats(it.week?:"" ,it.workouts?:0, it.distance?:0.0, it.duration?:0)}?:emptyList(), monthlyStats=d.monthlyStats?.map{MonthlyStats(it.month?:"" ,it.workouts?:0, it.distance?:0.0, it.duration?:0, it.calories?:0)}?:emptyList(), activityBreakdown=d.activityBreakdown?.map{ActivityBreakdown(it.type?:"" ,it.count?:0, it.totalDistance?:0.0, it.totalDuration?:0)}?:emptyList())) }
        is NetworkResult.Error -> NetworkResult.Error(r.error); is NetworkResult.Loading -> NetworkResult.Loading
    }
    override suspend fun getAchievements(): NetworkResult<List<Achievement>> = when (val r=api.getUserAchievements()) {
        is NetworkResult.Success -> NetworkResult.Success(r.data.map { Achievement(id=it.id?:"", name=it.name?:"", description=it.description?:"", icon=it.icon?:"" , category=it.category?:"" , earnedAt=it.earnedAt) })
        is NetworkResult.Error -> NetworkResult.Error(r.error); is NetworkResult.Loading -> NetworkResult.Loading
    }
}
