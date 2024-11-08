import Bool "mo:base/Bool";
import Int "mo:base/Int";

import Time "mo:base/Time";
import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Hash "mo:base/Hash";
import Option "mo:base/Option";

actor {
    // Post type definition
    public type Post = {
        id: Nat;
        title: Text;
        content: Text;
        timestamp: Int;
    };

    private stable var nextId : Nat = 0;
    private stable var postEntries : [(Nat, Post)] = [];
    
    // Initialize HashMap for posts
    private var posts = HashMap.HashMap<Nat, Post>(0, Nat.equal, Hash.hash);

    // System functions for upgrade persistence
    system func preupgrade() {
        postEntries := Iter.toArray(posts.entries());
    };

    system func postupgrade() {
        posts := HashMap.fromIter<Nat, Post>(postEntries.vals(), 1, Nat.equal, Hash.hash);
    };

    // Create a new post
    public func createPost(title : Text, content : Text) : async Post {
        let post : Post = {
            id = nextId;
            title = title;
            content = content;
            timestamp = Time.now();
        };
        posts.put(nextId, post);
        nextId += 1;
        post
    };

    // Get all posts
    public query func getAllPosts() : async [Post] {
        Iter.toArray(posts.vals())
    };

    // Get a specific post
    public query func getPost(id : Nat) : async ?Post {
        posts.get(id)
    };

    // Delete a post
    public func deletePost(id : Nat) : async Bool {
        switch (posts.remove(id)) {
            case (null) { false };
            case (?_) { true };
        }
    };
}
