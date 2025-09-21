package dev.bimishra.finance.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Configuration
@ConfigurationProperties(prefix = "accounts")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AccountConfig {

    /**
     * Maximum allowed accounts per user
     */
    private int maxPerUser = 2; // Default value

}
