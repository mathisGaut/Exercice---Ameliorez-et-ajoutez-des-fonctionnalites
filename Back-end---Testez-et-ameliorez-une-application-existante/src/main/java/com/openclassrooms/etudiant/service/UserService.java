package com.openclassrooms.etudiant.service;

import com.openclassrooms.etudiant.entities.User;
import com.openclassrooms.etudiant.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import java.util.Optional;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public void register(User user) {
        Assert.notNull(user, "User must not be null");
        // log.info("Registering new user");

        Optional<User> optionalUser = userRepository.findByLogin(user.getLogin());
        if (optionalUser.isPresent()) {
            throw new IllegalArgumentException("User with login " + user.getLogin() + " already exists");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
    }

    public String login(String login, String password) {
    
        // log.info("Tentative de login avec login='{}'", login);
    
        Assert.notNull(login, "Login must not be null");
        Assert.notNull(password, "Password must not be null");
    
        Optional<User> userOpt = userRepository.findByLogin(login);
    
        if (userOpt.isEmpty()) {
            log.warn("❌ Échec login : utilisateur '{}' introuvable", login);
            throw new BadCredentialsException("Invalid login");
        }
    
        User user = userOpt.get();
        // log.info("✔ Utilisateur '{}' trouvé en base", login);
    
        boolean passwordMatches = passwordEncoder.matches(password, user.getPassword());
    
        if (!passwordMatches) {
            log.warn("❌ Échec login : mot de passe incorrect pour '{}'", login);
            throw new BadCredentialsException("Invalid password");
        }
    
        // log.info("✅ Authentification réussie pour '{}'", login);
    
        UserDetails userDetails = org.springframework.security.core.userdetails.User
                .builder()
                .username(login)
                .password(user.getPassword())
                .authorities("USER")
                .build();
    
        return jwtService.generateToken(userDetails);
    }
    


}
