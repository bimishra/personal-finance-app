package dev.bimishra.finance.controller;

import dev.bimishra.finance.dto.UserDto;
import dev.bimishra.finance.service.UserProvisioningService;
import dev.bimishra.finance.util.UserInfoClientUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/me")
@Slf4j
public class MeController {

    private final UserProvisioningService provisioningService;
    private final UserInfoClientUtil userInfoClient;

    public MeController(UserProvisioningService provisioningService, UserInfoClientUtil userInfoClient) {
        this.provisioningService = provisioningService;
        this.userInfoClient = userInfoClient;
    }

    @GetMapping
    public ResponseEntity<UserDto> getCurrentUser(@AuthenticationPrincipal Jwt jwt) {
        String issuer = jwt.getIssuer().toString();
        String subject = jwt.getSubject();
        String accessToken = jwt.getTokenValue();
        log.debug("Issuer: {}", issuer);
        log.debug("Subject: {}", subject);
        // Email may be present in token or fallback to /userinfo
        String email = jwt.getClaim("email");
        if (email == null) {
            email = userInfoClient.fetchEmail(issuer, accessToken);
        }
        String name = jwt.getClaim("name");
        UserDto user = provisioningService.resolveOrCreateUser(issuer, subject, email, name);
        return ResponseEntity.ok(user);
    }
}