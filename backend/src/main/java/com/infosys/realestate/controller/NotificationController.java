package com.infosys.realestate.controller;

import com.infosys.realestate.entity.Notification;
import com.infosys.realestate.entity.User;
import com.infosys.realestate.repository.UserRepository;
import com.infosys.realestate.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
@PreAuthorize("isAuthenticated()")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserRepository userRepository;

    /** GET /api/notifications — all notifications for the logged-in user */
    @GetMapping
    public ResponseEntity<List<Notification>> getMyNotifications(Principal principal) {
        Long userId = resolveUserId(principal);
        return ResponseEntity.ok(notificationService.getNotificationsForUser(userId));
    }

    /** GET /api/notifications/unread — only unread notifications */
    @GetMapping("/unread")
    public ResponseEntity<List<Notification>> getUnread(Principal principal) {
        Long userId = resolveUserId(principal);
        return ResponseEntity.ok(notificationService.getUnreadNotifications(userId));
    }

    /** GET /api/notifications/unread-count — badge count */
    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(Principal principal) {
        Long userId = resolveUserId(principal);
        long count = notificationService.getUnreadCount(userId);
        return ResponseEntity.ok(Map.of("unreadCount", count));
    }

    /** PUT /api/notifications/{id}/read — mark single notification as read */
    @PutMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok().build();
    }

    /** PUT /api/notifications/read-all — mark all as read */
    @PutMapping("/read-all")
    public ResponseEntity<Void> markAllAsRead(Principal principal) {
        Long userId = resolveUserId(principal);
        notificationService.markAllAsRead(userId);
        return ResponseEntity.ok().build();
    }

    // ---- helper ---------------------------------------------------------

    private Long resolveUserId(Principal principal) {
        return userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getUserId();
    }
}
