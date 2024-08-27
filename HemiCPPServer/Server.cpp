#include <iostream>
#include <sys/socket.h>
#include <stdio.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <string.h>
#include <thread>
#include <vector>
#include <sstream>

using namespace std;

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

            // Process the message and create a response
            stringstream ss;
            ss << "C++ server received: " << buffer;
            string response = ss.str();

            int sent_bytes = send(client_sock, response.c_str(), response.length(), 0);
            if (sent_bytes < 0) {
                perror("error sending to client");
                break;
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
        perror("error listening to a socket");
        return 1;
    }

    cout << "C++ server listening on port " << server_port << endl;

    vector<thread> threads;  // Store threads to join later

    while (true) {
        struct sockaddr_in client_sin;
        unsigned int addr_len = sizeof(client_sin);
        int client_sock = accept(sock, (struct sockaddr *) &client_sin, &addr_len);
        if (client_sock < 0) {
            perror("error accepting client");
            continue;
        }

        // Create a new thread to handle the client
        threads.push_back(thread(handle_client, client_sock));
    }

    // Optionally join threads (though with an infinite loop, this won't happen)
    for (auto& t : threads) {
        t.join();
    }

    close(sock);  // Close the server socket
    return 0;
}