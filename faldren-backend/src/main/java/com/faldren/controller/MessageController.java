package com.faldren.controller;

import com.faldren.dto.ConversationResponse;
import com.faldren.dto.MessageResponse;
import com.faldren.dto.SendMessageRequest;

import com.faldren.service.MessageService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;


@RestController
public class MessageController {

    private final MessageService
            messageService;


    public MessageController(
            MessageService messageService
    ) {

        this.messageService =
                messageService;
    }



    // ==========================================
    // CLIENT - GET OWN MESSAGES
    // ==========================================

    @GetMapping("/api/client/messages")
    public ResponseEntity<?>
            getClientMessages(
                    Authentication authentication
            ) {

        try {

            List<MessageResponse> messages =
                    messageService
                            .getClientMessages(
                                    authentication.getName()
                            );


            return ResponseEntity.ok(
                    messages
            );


        } catch (RuntimeException exception) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    exception.getMessage()
                            )
                    );
        }
    }



    // ==========================================
    // CLIENT - SEND MESSAGE
    // ==========================================

    @PostMapping("/api/client/messages")
    public ResponseEntity<?>
            sendClientMessage(
                    Authentication authentication,

                    @Valid
                    @RequestBody
                    SendMessageRequest request
            ) {

        try {

            MessageResponse response =
                    messageService
                            .sendClientMessage(
                                    authentication.getName(),
                                    request.getMessage()
                            );


            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(response);


        } catch (RuntimeException exception) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    exception.getMessage()
                            )
                    );
        }
    }



    // ==========================================
    // ADMIN - GET ALL CLIENT CONVERSATIONS
    // ==========================================

    @GetMapping("/api/admin/messages")
    public ResponseEntity<?>
            getAllConversations(
                    Authentication authentication
            ) {

        try {

            List<ConversationResponse> conversations =
                    messageService
                            .getAllConversations(
                                    authentication.getName()
                            );


            return ResponseEntity.ok(
                    conversations
            );


        } catch (RuntimeException exception) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    exception.getMessage()
                            )
                    );
        }
    }



    // ==========================================
    // ADMIN - GET CONVERSATION MESSAGES
    // ==========================================

    @GetMapping(
            "/api/admin/messages/{conversationId}"
    )
    public ResponseEntity<?>
            getConversationMessages(
                    Authentication authentication,

                    @PathVariable
                    Long conversationId
            ) {

        try {

            List<MessageResponse> messages =
                    messageService
                            .getConversationMessages(
                                    authentication.getName(),
                                    conversationId
                            );


            return ResponseEntity.ok(
                    messages
            );


        } catch (RuntimeException exception) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    exception.getMessage()
                            )
                    );
        }
    }



    // ==========================================
    // ADMIN - SEND MESSAGE
    // ==========================================

    @PostMapping(
            "/api/admin/messages/{conversationId}"
    )
    public ResponseEntity<?>
            sendAdminMessage(
                    Authentication authentication,

                    @PathVariable
                    Long conversationId,

                    @Valid
                    @RequestBody
                    SendMessageRequest request
            ) {

        try {

            MessageResponse response =
                    messageService
                            .sendAdminMessage(
                                    authentication.getName(),
                                    conversationId,
                                    request.getMessage()
                            );


            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(response);


        } catch (RuntimeException exception) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    exception.getMessage()
                            )
                    );
        }
    }
}
