package dev.bimishra.finance.util;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Recover;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Duration;
import java.util.Map;

@Slf4j
@Component
public class UserInfoClientUtil {

    private final WebClient webClient;

    public UserInfoClientUtil(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }


    /**
     * Fetches the email claim from the OIDC provider's /userinfo endpoint.
     * Retries up to 3 times with exponential backoff on failure.
     *
     * @param issuer      The issuer URL of the OIDC provider
     * @param accessToken The access token to authorize the request
     * @return The email claim if present, otherwise null
     */
    @Retryable(retryFor = {RuntimeException.class},   // modern replacement for "value"
            maxAttempts = 3, backoff = @Backoff(delay = 2000, multiplier = 2) // 2s, then 4s
    )
    public String fetchEmail(String issuer, String accessToken) {
        String userInfoEndpoint = issuer.replaceAll("/$", "") + "/userinfo";

        try {
            Map<String, Object> response = webClient.get().uri(userInfoEndpoint).headers(h -> h.setBearerAuth(accessToken)).retrieve().bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {
            }).block(Duration.ofSeconds(5));

            if (response != null && response.containsKey("email")) {
                return (String) response.get("email");
            } else {
                throw new IllegalStateException("No email claim returned from /userinfo");
            }
        } catch (Exception e) {
            throw new IllegalStateException("Failed to fetch email from /userinfo: " + e.getMessage(), e);
        }
    }

    @Recover
    public String recoverFetchEmail(Exception e, String issuer, String accessToken) {
        // Optional: Log and return null instead of failing request
        log.error("Giving up fetching email from /userinfo after retries. issuer={} error={}", issuer, e.getMessage());
        return null;
    }
}

