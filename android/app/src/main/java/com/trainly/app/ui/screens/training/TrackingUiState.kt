package com.trainly.app.ui.screens.training
data class TrackingUiState(val activityType:String="", val isActive:Boolean=false, val isPaused:Boolean=false, val durationSeconds:Int=0, val distance:Double=0.0, val currentPace:Double=0.0, val averagePace:Double=0.0, val currentSpeed:Double=0.0, val averageSpeed:Double=0.0, val maxSpeed:Double=0.0, val calories:Int=0, val splitCount:Int=0, val gpsPoints:List<GpsCoordinate>=emptyList(), val currentLocation:GpsCoordinate?=null, val isFinishing:Boolean=false, val error:String?=null)
data class GpsCoordinate(val latitude:Double, val longitude:Double, val altitude:Double=0.0, val timestamp:Long=System.currentTimeMillis(), val speed:Float=0f)
fun formatDuration(s:Int):String { val h=s/3600; val m=(s%3600)/60; val sec=s%60; return if(h>0)"%02d:%02d:%02d".format(h,m,sec) else "%02d:%02d".format(m,sec) }
fun formatPace(km:Double, sec:Int):String { if(km<=0||sec<=0)return "--:--"; val spk=sec/km; return "%d:%02d".format((spk/60).toInt(), (spk%60).toInt()) }
fun formatDistance(m:Double):String = if(m>=1000)"%.2f km".format(m/1000) else "%.0f m".format(m)
fun calculateDistance(p1:GpsCoordinate, p2:GpsCoordinate):Double { val R=6371000.0; val dLat=Math.toRadians(p2.latitude-p1.latitude); val dLon=Math.toRadians(p2.longitude-p1.longitude); val a=Math.sin(dLat/2).pow(2)+Math.cos(Math.toRadians(p1.latitude))*Math.cos(Math.toRadians(p2.latitude))*Math.sin(dLon/2).pow(2); return R*2*Math.atan2(Math.sqrt(a), Math.sqrt(1-a)) }
private fun Double.pow(e:Int):Double { var r=1.0; repeat(e){r*=this}; return r }
