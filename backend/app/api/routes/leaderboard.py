from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Query
from pydantic import BaseModel

router = APIRouter()


class LeaderboardEntry(BaseModel):
    """Single leaderboard entry"""
    user_id: str
    user_name: str
    avatar: str
    rank: int
    points: int
    streak: int
    adherence: float
    change: int  # Position change from last period
    is_current_user: bool = False


class LeaderboardResponse(BaseModel):
    """Leaderboard response with metadata"""
    period: str  # all_time, month, week
    entries: List[LeaderboardEntry]
    user_rank: Optional[LeaderboardEntry] = None
    total_participants: int


class PointsBreakdown(BaseModel):
    """How points are earned"""
    action: str
    points: int
    description: str


@router.get("/", response_model=LeaderboardResponse, summary="Get leaderboard")
async def get_leaderboard(
    period: str = Query(default="month", description="all_time, month, week"),
    limit: int = Query(default=10, ge=1, le=100),
    user_id: str = Query(default="demo-user")
):
    """Get the leaderboard for a specific time period"""
    
    sample_entries = [
        LeaderboardEntry(
            user_id="user_1", user_name="Emma Wilson", avatar="👩‍🦰",
            rank=1, points=2450, streak=45, adherence=98, change=0
        ),
        LeaderboardEntry(
            user_id="user_2", user_name="James Chen", avatar="👨",
            rank=2, points=2280, streak=38, adherence=95, change=1
        ),
        LeaderboardEntry(
            user_id="user_3", user_name="Sofia Rodriguez", avatar="👩",
            rank=3, points=2150, streak=42, adherence=92, change=-1
        ),
        LeaderboardEntry(
            user_id="demo-user", user_name="You", avatar="🙂",
            rank=4, points=1820, streak=18, adherence=88, change=2, is_current_user=True
        ),
        LeaderboardEntry(
            user_id="user_5", user_name="Alex Thompson", avatar="🧔",
            rank=5, points=1650, streak=28, adherence=85, change=-1
        ),
        LeaderboardEntry(
            user_id="user_6", user_name="Priya Patel", avatar="👩‍🦱",
            rank=6, points=1480, streak=22, adherence=82, change=0
        ),
        LeaderboardEntry(
            user_id="user_7", user_name="Marcus Johnson", avatar="👨‍🦱",
            rank=7, points=1320, streak=15, adherence=80, change=3
        ),
        LeaderboardEntry(
            user_id="user_8", user_name="Lisa Wang", avatar="👧",
            rank=8, points=1200, streak=19, adherence=78, change=-2
        ),
        LeaderboardEntry(
            user_id="user_9", user_name="David Kim", avatar="👨‍🦰",
            rank=9, points=980, streak=12, adherence=75, change=0
        ),
        LeaderboardEntry(
            user_id="user_10", user_name="Sarah Miller", avatar="👱‍♀️",
            rank=10, points=850, streak=8, adherence=72, change=1
        ),
    ]
    
    user_entry = next((e for e in sample_entries if e.user_id == user_id), None)
    
    return LeaderboardResponse(
        period=period,
        entries=sample_entries[:limit],
        user_rank=user_entry,
        total_participants=1247
    )


@router.get("/friends", response_model=LeaderboardResponse, summary="Get friends leaderboard")
async def get_friends_leaderboard(
    user_id: str = Query(default="demo-user"),
    limit: int = Query(default=10, ge=1, le=50)
):
    """Get leaderboard for user's friends only"""
    
    friends_entries = [
        LeaderboardEntry(
            user_id="demo-user", user_name="You", avatar="🙂",
            rank=1, points=1820, streak=18, adherence=88, change=0, is_current_user=True
        ),
        LeaderboardEntry(
            user_id="friend_1", user_name="Alex Thompson", avatar="🧔",
            rank=2, points=1650, streak=28, adherence=85, change=0
        ),
        LeaderboardEntry(
            user_id="friend_2", user_name="Priya Patel", avatar="👩‍🦱",
            rank=3, points=1480, streak=22, adherence=82, change=1
        ),
    ]
    
    return LeaderboardResponse(
        period="friends",
        entries=friends_entries,
        user_rank=friends_entries[0],
        total_participants=3
    )


@router.get("/points-system", response_model=List[PointsBreakdown], summary="Get points system")
async def get_points_system():
    """Get explanation of how points are earned"""
    return [
        PointsBreakdown(
            action="complete_meal",
            points=10,
            description="Complete a planned meal"
        ),
        PointsBreakdown(
            action="daily_streak",
            points=5,
            description="Bonus for each day of streak"
        ),
        PointsBreakdown(
            action="hydration_goal",
            points=15,
            description="Reach daily water intake goal"
        ),
        PointsBreakdown(
            action="perfect_day",
            points=50,
            description="Complete all meals and goals for a day"
        ),
        PointsBreakdown(
            action="weekly_goal",
            points=100,
            description="Meet weekly calorie and macro targets"
        ),
        PointsBreakdown(
            action="weight_log",
            points=5,
            description="Log your weight"
        ),
    ]


@router.post("/invite", summary="Invite a friend")
async def invite_friend(
    email: str = Query(..., description="Friend's email address"),
    user_id: str = Query(default="demo-user")
):
    """Send an invitation to a friend to join SnackTrack"""
    return {
        "message": f"Invitation sent to {email}",
        "bonus_points": 50,
        "note": "You'll earn 50 bonus points when your friend joins!"
    }


