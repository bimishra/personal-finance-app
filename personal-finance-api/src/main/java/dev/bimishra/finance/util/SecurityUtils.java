package dev.bimishra.finance.util;

import dev.bimishra.finance.service.IdentityLinkService;
import jdk.dynalink.linker.LinkerServices;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class SecurityUtils {
    private static IdentityLinkService identityLinkService;

    public SecurityUtils(IdentityLinkService identityLinkService) {
        SecurityUtils.identityLinkService = identityLinkService;
    }

    public static UUID getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication instanceof JwtAuthenticationToken jwtAuthentication) {
            Jwt jwt = jwtAuthentication.getToken();
            String subject = jwt.getSubject();
            String issuer = jwt.getIssuer().toString();

            if (subject != null && issuer != null) {
                try {
                    return identityLinkService.getInternalUserId(issuer, subject);
                } catch (IllegalArgumentException e) {
                    throw new SecurityException("Invalid user ID format in JWT subject", e);
                }
            }
        }

        throw new SecurityException("No authenticated user found");
    }

    public static String getCurrentUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication instanceof JwtAuthenticationToken jwtAuthentication) {
            Jwt jwt = jwtAuthentication.getToken();
            return jwt.getClaimAsString("email");
        }

        throw new SecurityException("No authenticated user found");
    }

    public static boolean hasRole(String role) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication instanceof JwtAuthenticationToken jwtAuthentication) {
            Jwt jwt = jwtAuthentication.getToken();
            var roles = jwt.getClaimAsStringList("roles");
            return roles != null && roles.contains(role);
        }

        return false;
    }

    public static boolean isAdmin() {
        return hasRole("ADMIN");
    }
}