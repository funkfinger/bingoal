import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    // Get the authenticated user
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Parse request body
    const body = await request.json()
    const { goal_id } = body

    if (!goal_id) {
      return NextResponse.json(
        { success: false, error: 'Goal ID is required' },
        { status: 400 }
      )
    }

    // Verify the goal belongs to the user's board
    const { data: goal, error: goalError } = await supabase
      .from('goals')
      .select('board_id, is_free_space, boards!inner(user_id)')
      .eq('id', goal_id)
      .single()

    if (goalError || !goal) {
      return NextResponse.json(
        { success: false, error: 'Goal not found' },
        { status: 404 }
      )
    }

    // TypeScript workaround for nested object
    const goalData = goal as any
    if (goalData.boards.user_id !== session.user.id) {
      return NextResponse.json(
        { success: false, error: 'Access denied' },
        { status: 403 }
      )
    }

    // Prevent deleting free space goals
    if (goalData.is_free_space) {
      return NextResponse.json(
        {
          success: false,
          error: 'Cannot delete free space goal',
        },
        { status: 400 }
      )
    }

    // Delete the goal
    const { error: deleteError } = await supabase
      .from('goals')
      .delete()
      .eq('id', goal_id)

    if (deleteError) {
      console.error('Error deleting goal:', deleteError)
      return NextResponse.json(
        { success: false, error: 'Failed to delete goal' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Unexpected error in delete goal API:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

