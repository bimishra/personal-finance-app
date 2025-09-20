package dev.bimishra.finance.config;

import dev.bimishra.finance.service.IdentityLinkService;
import dev.bimishra.finance.util.UserInfoClientUtil;
import jakarta.persistence.Converter;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class CustomJwtAuthenticationConverter extends JwtAuthenticationConverter {

    private final IdentityLinkService userLinkService;
    private final UserInfoClientUtil userInfoClient; // fetch from IdP

    public CustomJwtAuthenticationConverter(IdentityLinkService userLinkService, UserInfoClientUtil userInfoClient) {
        this.userLinkService = userLinkService;
        this.userInfoClient = userInfoClient;
    }


    protected Authentication extractAuthentication(Jwt jwt) {
        String provider = jwt.getIssuer().toString();
        String subject = jwt.getSubject();

        // Resolve internal user ID
        UUID userId = userLinkService.getInternalUserId(provider, subject);

        // Try email from JWT
        String email = jwt.getClaimAsString("email");

        // If email not present, fetch from /userinfo
        if (email == null || email.isBlank()) {
            email = userInfoClient.fetchEmail(provider, jwt.getTokenValue());
        }

        UserPrincipal principal = new UserPrincipal(userId, email, jwt);

        return new UsernamePasswordAuthenticationToken(
                principal,
                "N/A",
                principal.getAuthorities()
        );
    }
}

