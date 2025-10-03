<?php



namespace App\Http\Controllers; // Corrected namespace

// ✅ --- ADD THIS LINE ---
use App\Http\Controllers\Controller;
use App\Models\Topic;
use Illuminate\Http\Request;

class TopicController extends Controller
{
    public function index()
    {
        return Topic::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate(['name' => 'required|string|unique:topics|max:255']);
        $topic = Topic::create($validated);
        return response()->json($topic, 201);
    }

    public function show(Topic $topic)
    {
        return $topic;
    }

    public function update(Request $request, Topic $topic)
    {
        $validated = $request->validate(['name' => 'required|string|unique:topics,name,' . $topic->id . '|max:255']);
        $topic->update($validated);
        return response()->json($topic);
    }

    public function destroy(Topic $topic)
    {
        $topic->delete();
        return response()->json(null, 204);
    }
}