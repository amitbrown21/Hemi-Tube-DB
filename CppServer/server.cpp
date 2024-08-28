#include <iostream>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <string.h>
#include <thread>
#include <vector>
#include <sstream>
#include <unordered_map>
#include <unordered_set>
#include <algorithm>
#include <random>

using namespace std;

// Track video watch patterns: video ID -> set of other videos watched together
unordered_map<string, unordered_map<string, int>> videoWatchPatterns;

// Track video popularity: video ID -> view count
unordered_map<string, int> videoPopularity;

void updateWatchPatterns(const string& userId, const string& watchedVideo) {
    // Update the watch count for the video
    videoPopularity[watchedVideo]++;

    // Update the patterns: record that this user watched this video
    for (auto& [video, count] : videoWatchPatterns[watchedVideo]) {
        videoWatchPatterns[video][watchedVideo]++;
    }

    // Initialize the entry for the watched video if it doesn't exist
    videoWatchPatterns[watchedVideo];
}

vector<string> getRecommendations(const string& watchedVideo) {
    vector<pair<string, int>> recommendations;

    // Gather all related videos with their counts
    for (const auto& [video, count] : videoWatchPatterns[watchedVideo]) {
        if (video != watchedVideo) {
            recommendations.push_back({video, count});
        }
    }

    // Sort recommendations based on popularity (higher count first)
    sort(recommendations.begin(), recommendations.end(), 
        [](const pair<string, int>& a, const pair<string, int>& b) {
            return a.second > b.second || (a.second == b.second && videoPopularity[a.first] > videoPopularity[b.first]);
        });

    // Extract the top 6-10 recommendations
    vector<string> recommendedVideos;
    int numRecommendations = min(10, max(8, (int)recommendations.size()));
    for (int i = 0; i < numRecommendations && i < (int)recommendations.size(); ++i) {
        recommendedVideos.push_back(recommendations[i].first);
    }

    // If we don't have enough recommendations, add some random videos
    if (recommendedVideos.size() < 10) {
        vector<string> allVideos;
        for (const auto& [video, _] : videoPopularity) {
            if (find(recommendedVideos.begin(), recommendedVideos.end(), video) == recommendedVideos.end()) {
                allVideos.push_back(video);
            }
        }

        random_device rd;
        mt19937 gen(rd());
        shuffle(allVideos.begin(), allVideos.end(), gen);

        while (recommendedVideos.size() < 10 && !allVideos.empty()) {
            recommendedVideos.push_back(allVideos.back());
            allVideos.pop_back();
        }
    }

    return recommendedVideos;
}

void handle_client(int client_sock) {
    char buffer[4096];
    while (true) {
        int read_bytes = recv(client_sock, buffer, sizeof(buffer), 0);
        if (read_bytes == 0) {
            cout << "Connection closed by client" << endl;
            break;
        } else if (read_bytes < 0) {
            perror("error receiving from client");
            break;
        } else {
            buffer[read_bytes] = '\0'; // Null-terminate the received data
            cout << "Received from Node.js server: " << buffer << endl;

            stringstream ss(buffer);
            string command, userId, watchedVideo;
            ss >> command >> userId >> watchedVideo;

            if (command == "WATCH") {
                // Update the watch patterns and popularity
                updateWatchPatterns(userId, watchedVideo);
            } else if (command == "RECOMMEND") {
    // Get recommendations based on the watched video
    vector<string> recommendations = getRecommendations(watchedVideo);

    // Log the recommendations
    cout << "Sending recommendations to user " << userId << " for video " << watchedVideo << ": ";
    for (const string& video : recommendations) {
        cout << video << " ";
    }
    cout << endl;

    // Format the response
    stringstream response_ss;
    response_ss << "Recommendations for " << userId << " based on " << watchedVideo << ": ";
    for (const string& video : recommendations) {
        response_ss << video << " ";
    }

    string response = response_ss.str();
    send(client_sock, response.c_str(), response.length(), 0);
}
        }
    }
    close(client_sock);  // Close the client's socket when done
}

int main() {
    const int server_port = 5557;
    int sock = socket(AF_INET, SOCK_STREAM, 0);
    if (sock < 0) {
        perror("error creating socket");
        return 1;
    }

    struct sockaddr_in sin;
    memset(&sin, 0, sizeof(sin));
    sin.sin_family = AF_INET;
    sin.sin_addr.s_addr = INADDR_ANY;
    sin.sin_port = htons(server_port);

    if (bind(sock, (struct sockaddr *) &sin, sizeof(sin)) < 0) {
        perror("error binding socket");
        return 1;
    }

    if (listen(sock, 5) < 0) {
        perror("error listening to socket");
        return 1;
    }

    cout << "C++ server listening on port " << server_port << endl;

    while (true) {
        struct sockaddr_in client_sin;
        unsigned int addr_len = sizeof(client_sin);
        int client_sock = accept(sock, (struct sockaddr *) &client_sin, &addr_len);
        if (client_sock < 0) {
            perror("error accepting client");
            continue;
        }

        // Create a new thread to handle the client
        thread(handle_client, client_sock).detach();
    }

    close(sock);  // Close the server socket
    return 0;
}
