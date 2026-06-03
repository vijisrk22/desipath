<?php

namespace App\Http\Controllers;

use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Log;
// use App\Http\Controllers\Controller;

class MessageController extends Controller
{
    /**
    * @OA\Get(
    *     path="/api/messages/{userId}",
    *     summary="Get chat messages between two users",
    *     description="Fetch all messages between the authenticated user and another user",
    *     operationId="getMessages",
    *     tags={"Chat"},
    *     security={{"bearerAuth":{}}},
    *     @OA\Parameter(
    *         name="userId",
    *         in="path",
    *         required=true,
    *         @OA\Schema(type="integer")
    *     ),
    *     @OA\Response(
    *         response=200,
    *         description="List of messages between users",
    *         @OA\JsonContent(
    *             type="array",
    *             @OA\Items(
    *                 @OA\Property(property="id", type="integer", description="Message ID"),
    *                 @OA\Property(property="sender_id", type="integer", description="Sender User ID"),
    *                 @OA\Property(property="receiver_id", type="integer", description="Receiver User ID"),
    *                 @OA\Property(property="receiver_name", type="string", description="Receiver Name"),
    *                 @OA\Property(property="message", type="string", description="Message content"),
    *                 @OA\Property(property="created_at", type="string", format="date-time", description="Message sent timestamp"),
    *                 @OA\Property(property="updated_at", type="string", format="date-time", description="Message updated timestamp")
    *             )
    *         )
    *     ),
    *     @OA\Response(
    *         response=401,
    *         description="Unauthorized"
    *     ),
    *     @OA\Response(
    *         response=404,
    *         description="User or messages not found"
    *     )
    * )
    */
    // Fetch messages between two users
    public function index($userId)
    {
        $authUserId = Auth::id(); // Get authenticated user ID

        $messages = Message::where(function ($query) use ($authUserId, $userId) {
            $query->where('sender_id', $authUserId)
                ->where('receiver_id', $userId);
        })->orWhere(function ($query) use ($authUserId, $userId) {
            $query->where('sender_id', $userId)
                ->where('receiver_id', $authUserId);
        })
        ->orderBy('created_at', 'asc')
        ->get();

        if ($messages->isEmpty()) {
            return response()->json(['message' => 'No messages found'], 404);
        }

        return response()->json($messages);
    }

    /**
     * @OA\Get(
     *     path="/api/messages/ad/{adId}/type/{adType}/user/{userId}",
     *     summary="Get chat messages for an ad between authenticated user and another user",
     *     description="Retrieve all messages for a specific ad involving the authenticated user and the specified user",
     *     operationId="getMessagesForAd",
     *     tags={"Chat"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="adId",
     *         in="path",
     *         required=true,
     *         description="Ad ID to filter messages by",
     *         @OA\Schema(type="integer")
     *     ),
     *      @OA\Parameter(
    *         name="adType",
    *         in="path",
    *         required=true,
    *         description="Type of the ad (e.g., 'car', 'property')",
    *         @OA\Schema(type="string")
    *     ),
     *     @OA\Parameter(
     *         name="userId",
     *         in="path",
     *         required=true,
     *         description="The ID of the user who is in chat with the authenticated user",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="List of messages",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(
     *                 @OA\Property(property="id", type="integer"),
     *                 @OA\Property(property="sender_id", type="integer"),
     *                 @OA\Property(property="sender_name", type="string"),
     *                 @OA\Property(property="receiver_id", type="integer"),
     *                 @OA\Property(property="receiver_name", type="string"),
     *                 @OA\Property(property="message", type="string"),
     *                 @OA\Property(property="ad_id", type="integer"),
     *                 @OA\Property(property="ad_type", type="string"),
     *                 @OA\Property(property="created_at", type="string", format="date-time"),
     *                 @OA\Property(property="updated_at", type="string", format="date-time")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="No messages found"
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthorized"
     *     )
     * )
     */
    public function getMessagesForAd($adId, $adType, $userId)
    {
        $authUserId = Auth::id();
        // \Log::info([
        //     'ad_id' => $adId,
        //     'ad_type' => $adType,
        //     'authUserId' => $authUserId,
        //     'userId' => $userId,
        // ]);
        $messages = Message::where('ad_id', $adId)
            ->where('ad_type', $adType)
            ->where(function ($query) use ($authUserId, $userId) {
                $query->where(function ($q) use ($authUserId, $userId) {
                    $q->where('sender_id', $authUserId)
                    ->where('receiver_id', $userId);
                })->orWhere(function ($q) use ($authUserId, $userId) {
                    $q->where('sender_id', $userId)
                    ->where('receiver_id', $authUserId);
                });
            })
            ->orderBy('created_at', 'asc')
            ->get();

        if ($messages->isEmpty()) {
            return response()->json(['message' => 'No messages found'], 404);
        }

        return response()->json($messages);
    }

    /**
     * @OA\Get(
     *     path="/api/messages/sent",
     *     summary="Get all messages sent by the authenticated user",
     *     description="Fetch all messages where the sender_id matches the authenticated user",
     *     operationId="getMessagesBySender",
     *     tags={"Chat"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="List of messages sent by the authenticated user",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(
     *                 @OA\Property(property="id", type="integer", description="Message ID"),
     *                 @OA\Property(property="sender_id", type="integer", description="Sender User ID"),
     *                 @OA\Property(property="receiver_id", type="integer", description="Receiver User ID"),
     *                 @OA\Property(property="message", type="string", description="Message content"),
     *                 @OA\Property(property="created_at", type="string", format="date-time", description="Message sent timestamp"),
     *                 @OA\Property(property="updated_at", type="string", format="date-time", description="Message updated timestamp")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthorized"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="No messages found"
     *     )
     * )
     */
    public function getMessagesBySender()
    {
        // Get authenticated user's ID
        $authUserId = Auth::id();

        // Retrieve all messages where sender_id or receiver_id is the authenticated user
        $messages = Message::where('sender_id', $authUserId)
            ->orWhere('receiver_id', $authUserId)
            ->orderBy('created_at', 'desc')
            ->get();

        // If no messages are found, return a 404 response with a message
        if ($messages->isEmpty()) {
            return response()->json(['message' => 'No messages found'], 404);
        }

        // Return the messages as JSON
        return response()->json($messages);
    }

    /**
     * @OA\Get(
     *     path="/api/messages/conversations",
     *     summary="Get all conversations for the authenticated user",
     *     description="Fetch a grouped list of conversations involving the authenticated user",
     *     operationId="getConversations",
     *     tags={"Chat"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="List of conversations",
     *     )
     * )
     */
    public function getConversations()
    {
        $userId = Auth::id();

        // Get the latest message for each conversation thread
        // A conversation is defined by (ad_id, ad_type, and the other participant)
        $subquery = Message::select(\DB::raw('MAX(id) as max_id'))
            ->where(function($q) use ($userId) {
                $q->where('sender_id', $userId)
                  ->orWhere('receiver_id', $userId);
            })
            ->groupBy('ad_id', 'ad_type', \DB::raw('CASE WHEN sender_id = ' . $userId . ' THEN receiver_id ELSE sender_id END'));

        $conversations = Message::whereIn('id', $subquery)
            ->orderBy('created_at', 'desc')
            ->get();

        foreach ($conversations as $chat) {
            $isSender = $chat->sender_id == $userId;
            $partnerId = $isSender ? $chat->receiver_id : $chat->sender_id;
            
            // Try to use stored names first, fallback to DB lookup
            $partnerName = $isSender ? $chat->receiver_name : $chat->sender_name;
            
            if (!$partnerName) {
                $partner = User::find($partnerId);
                $partnerName = $partner ? $partner->name : 'Unknown User';
            }

            $chat->chatPartner = [
                'id' => $partnerId,
                'name' => $partnerName,
            ];
            
            // Add other names for consistency
            if (!$chat->sender_name) {
                $s = User::find($chat->sender_id);
                $chat->sender_name = $s ? $s->name : 'Unknown';
            }
            if (!$chat->receiver_name) {
                $r = User::find($chat->receiver_id);
                $chat->receiver_name = $r ? $r->name : 'Unknown';
            }

            // Calculate unread count (messages sent by the partner to the auth user, which are not yet read)
            $chat->unread_count = Message::where('sender_id', $partnerId)
                ->where('receiver_id', $userId)
                ->where('ad_id', $chat->ad_id)
                ->where('ad_type', $chat->ad_type)
                ->where('is_read', false)
                ->count();
        }

        return response()->json($conversations);
    }



    /**
     * @OA\Post(
     *     path="/api/messages",
     *     summary="Send a message",
     *     description="Send a message from the authenticated user to another user",
     *     operationId="sendMessage",
     *     tags={"Chat"},
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"receiver_id", "receiver_name", "message", "ad_id"},
     *             @OA\Property(property="receiver_id", type="integer", description="Receiver User ID"),
     *             @OA\Property(property="message", type="string", description="Message content"),
     *             @OA\Property(property="ad_id", type="integer", description="Ad ID related to the conversation"),
     *             @OA\Property(property="ad_type", type="string", enum={"roommate", "car"}, description="Type of ad (e.g., roommate, car)")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Message sent successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="id", type="integer", description="Message ID"),
     *             @OA\Property(property="sender_id", type="integer", description="Sender User ID"),
     *             @OA\Property(property="sender_name", type="string", description="Sender Name"),
     *             @OA\Property(property="receiver_id", type="integer", description="Receiver User ID"),
     *             @OA\Property(property="receiver_name", type="string", description="Receiver Name"),
     *             @OA\Property(property="ad_id", type="integer", description="Ad ID"),
     *             @OA\Property(property="ad_type", type="string", description="Ad Type (e.g., roommate, car)"),
     *             @OA\Property(property="message", type="string", description="Message content"),
     *             @OA\Property(property="created_at", type="string", format="date-time", description="Message sent timestamp"),
     *             @OA\Property(property="updated_at", type="string", format="date-time", description="Message updated timestamp")
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Bad Request"
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthorized"
     *     )
     * )
     */
    // Send a message
    public function store(Request $request)
    {
        //print_r(Auth::id(), ' hello');
        //exit(12);

        // 'receiver_name' => 'required|string|max:255',
        $request->validate([
            'receiver_id' => 'required|exists:users,id',
            'message' => 'required|string|max:1000',
            'ad_id' => 'required|integer', // Validate ad ID
            'ad_type' => 'required|string|in:roommate,car,rentalhome,buysellhome,travelcompanion,astrologyad,classesforkid,trainingad,localjob,jobreferral,itjob,financial_advisor',
        ]);

        $authUser = Auth::user();
        $receiverId = $request->receiver_id;
        // Fetch receiver name from the users table
        $receiver = User::find($receiverId);

        if ($receiver) {
            $receiverName = $receiver->name;
        
            $message = Message::create([
                'sender_id' => $authUser->id,
                'sender_name' => $authUser->name,
                'receiver_id' => $receiver->id,
                'receiver_name' => $receiver->name,
                'ad_id' => $request->ad_id,
                'ad_type' => $request->ad_type,
                'message' => $request->message,
                'is_read' => false,
            ]);
        } else {
            // Handle case where user is not found
            return response()->json(['error' => 'Receiver not found'], 404);
        }
        return response()->json($message, 201);
    }

    /**
     * Mark messages in a conversation as read
     */
    public function markAsRead(Request $request)
    {
        $request->validate([
            'sender_id' => 'required|integer',
            'ad_id' => 'required|integer',
            'ad_type' => 'required|string',
        ]);

        $authUserId = Auth::id();
        $senderId = $request->sender_id;
        $adId = $request->ad_id;
        $adType = $request->ad_type;

        Message::where('sender_id', $senderId)
            ->where('receiver_id', $authUserId)
            ->where('ad_id', $adId)
            ->where('ad_type', $adType)
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return response()->json(['success' => true]);
    }
}
