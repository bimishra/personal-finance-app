package dev.bimishra.finance.config;

import lombok.Getter;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.Collections;
import java.util.UUID;

@Getter
public class UserPrincipal extends org.springframework.security.core.userdetails.User {
    private final UUID userId;
    private final String email;
    private final Jwt jwt;

    public UserPrincipal(UUID userId, String email, Jwt jwt) {
        super(jwt.getSubject(), "", Collections.emptyList());
        this.userId = userId;
        this.email = email;
        this.jwt = jwt;
    }

}

