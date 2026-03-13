package com.openclassrooms.etudiant.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.etudiant.dto.LoginRequestDTO;
import com.openclassrooms.etudiant.dto.RegisterDTO;
import com.openclassrooms.etudiant.dto.StudentRequestDTO;
import com.openclassrooms.etudiant.repository.StudentRepository;
import com.openclassrooms.etudiant.repository.UserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@Testcontainers
public class StudentControllerTest {

    private static final String FIRST_NAME = "John";
    private static final String LAST_NAME = "Doe";
    private static final String LOGIN = "studenttest";
    private static final String PASSWORD = "password";

    private static final String STUDENT_FIRST = "Jean";
    private static final String STUDENT_LAST = "Dupont";
    private static final String EMAIL = "jean@test.fr";
    private static final String PHONE = "0612345678";
    private static final String ADDRESS = "1 rue Test";
    private static final String CITY = "Paris";

    @Container
    static MySQLContainer<?> mySQLContainer = new MySQLContainer<>("mysql:8.0.45");

    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private StudentRepository studentRepository;

    private String jwtToken;

    // Configure les propriétés de test pour la base de données
    @DynamicPropertySource
    static void configureTestProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", mySQLContainer::getJdbcUrl);
        registry.add("spring.datasource.username", mySQLContainer::getUsername);
        registry.add("spring.datasource.password", mySQLContainer::getPassword);
        registry.add("spring.jpa.hibernate.ddl-auto", () -> "create");
    }

    // Configure le token JWT
    @BeforeEach
    void setUp() throws Exception {
        RegisterDTO registerDTO = new RegisterDTO();
        registerDTO.setFirstName(FIRST_NAME);
        registerDTO.setLastName(LAST_NAME);
        registerDTO.setLogin(LOGIN);
        registerDTO.setPassword(PASSWORD);
        mockMvc.perform(MockMvcRequestBuilders.post("/api/register")
                .content(objectMapper.writeValueAsString(registerDTO))
                .contentType(MediaType.APPLICATION_JSON));

        LoginRequestDTO loginRequest = new LoginRequestDTO();
        loginRequest.setLogin(LOGIN);
        loginRequest.setPassword(PASSWORD);
        MvcResult loginResult = mockMvc.perform(MockMvcRequestBuilders.post("/api/login")
                        .content(objectMapper.writeValueAsString(loginRequest))
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.ALL))
                .andReturn();
        jwtToken = loginResult.getResponse().getContentAsString();
    }

    // Supprime les données de la base de données
    @AfterEach
    void tearDown() {
        studentRepository.deleteAll();
        userRepository.deleteAll();
    }

    // Test GET /api/students
    @Test
    void getStudents_withJwt_returns200() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/api/students")
                        .header("Authorization", "Bearer " + jwtToken)
                        .accept(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(MockMvcResultMatchers.status().isOk());
    }

    // Test POST /api/students
    @Test
    void postStudent_withJwt_returns201() throws Exception {
        StudentRequestDTO dto = new StudentRequestDTO();
        dto.setFirstName(STUDENT_FIRST);
        dto.setLastName(STUDENT_LAST);
        dto.setEmail(EMAIL);
        dto.setPhone(PHONE);
        dto.setAddress(ADDRESS);
        dto.setCity(CITY);

        mockMvc.perform(MockMvcRequestBuilders.post("/api/students")
                        .header("Authorization", "Bearer " + jwtToken)
                        .content(objectMapper.writeValueAsString(dto))
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(MockMvcResultMatchers.status().isCreated())
                .andExpect(MockMvcResultMatchers.jsonPath("$.firstName").value(STUDENT_FIRST))
                .andExpect(MockMvcResultMatchers.jsonPath("$.lastName").value(STUDENT_LAST));
    }

    // Test PUT /api/students/{id}
    @Test
    void putStudent_withJwt_returns200() throws Exception {
        StudentRequestDTO createDto = new StudentRequestDTO();
        createDto.setFirstName(STUDENT_FIRST);
        createDto.setLastName(STUDENT_LAST);
        createDto.setEmail(EMAIL);
        createDto.setPhone(PHONE);
        createDto.setAddress(ADDRESS);
        createDto.setCity(CITY);

        MvcResult createResult = mockMvc.perform(MockMvcRequestBuilders.post("/api/students")
                        .header("Authorization", "Bearer " + jwtToken)
                        .content(objectMapper.writeValueAsString(createDto))
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isCreated())
                .andReturn();

        String body = createResult.getResponse().getContentAsString();
        Long id = objectMapper.readTree(body).get("id").asLong();

        createDto.setFirstName("Marie");
        createDto.setLastName("Martin");

        mockMvc.perform(MockMvcRequestBuilders.put("/api/students/" + id)
                        .header("Authorization", "Bearer " + jwtToken)
                        .content(objectMapper.writeValueAsString(createDto))
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.firstName").value("Marie"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.lastName").value("Martin"));
    }

    // Test DELETE /api/students/{id}
    @Test
    void deleteStudent_withJwt_returns204() throws Exception {
        StudentRequestDTO dto = new StudentRequestDTO();
        dto.setFirstName(STUDENT_FIRST);
        dto.setLastName(STUDENT_LAST);
        dto.setEmail(EMAIL);
        dto.setPhone(PHONE);
        dto.setAddress(ADDRESS);
        dto.setCity(CITY);

        MvcResult createResult = mockMvc.perform(MockMvcRequestBuilders.post("/api/students")
                        .header("Authorization", "Bearer " + jwtToken)
                        .content(objectMapper.writeValueAsString(dto))
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isCreated())
                .andReturn();

        String body = createResult.getResponse().getContentAsString();
        Long id = objectMapper.readTree(body).get("id").asLong();

        mockMvc.perform(MockMvcRequestBuilders.delete("/api/students/" + id)
                        .header("Authorization", "Bearer " + jwtToken))
                .andDo(print())
                .andExpect(MockMvcResultMatchers.status().isNoContent());
    }
}
