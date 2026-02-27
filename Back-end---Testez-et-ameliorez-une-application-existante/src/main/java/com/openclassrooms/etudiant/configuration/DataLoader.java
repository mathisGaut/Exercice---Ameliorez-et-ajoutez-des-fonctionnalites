package com.openclassrooms.etudiant.configuration;

import com.openclassrooms.etudiant.entities.User;
import com.openclassrooms.etudiant.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Crée un utilisateur par défaut au premier démarrage si la base est vide.
 * Évite le 401 "Invalid login" quand aucun compte n'a encore été créé.
 */
@Slf4j
@Component
@RequiredArgsConstructor
@Profile("!test")
public class DataLoader implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            return;
        }
        User defaultUser = new User();
        defaultUser.setFirstName("Demo");
        defaultUser.setLastName("User");
        defaultUser.setLogin("demo");
        defaultUser.setPassword(passwordEncoder.encode("demo"));
        userRepository.save(defaultUser);
        log.info("Utilisateur par défaut créé : login='demo', password='demo' (à utiliser pour la première connexion)");
    }
}
