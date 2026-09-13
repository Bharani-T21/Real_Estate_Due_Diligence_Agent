package com.infosys.realestate.config;

import com.infosys.realestate.entity.Property;
import com.infosys.realestate.entity.Role;
import com.infosys.realestate.entity.User;
import com.infosys.realestate.repository.PropertyRepository;
import com.infosys.realestate.repository.RoleRepository;
import com.infosys.realestate.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PropertyRepository propertyRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        List<String> rolesToSeed = List.of("ADMIN", "USER", "BUYER", "AGENT", "LEGAL_REVIEWER", "BANK");
        for (String roleName : rolesToSeed) {
            roleRepository.findByRoleName(roleName).orElseGet(() -> {
                Role r = new Role();
                r.setRoleName(roleName);
                return roleRepository.save(r);
            });
        }

        Role adminRole = roleRepository.findByRoleName("ADMIN").get();

        User adminUser = userRepository.findByEmail("admin@example.com").orElseGet(() -> {
            User u = new User();
            u.setName("System Admin");
            u.setEmail("admin@example.com");
            u.setPassword(passwordEncoder.encode("admin123"));
            u.setRole(adminRole);
            return userRepository.save(u);
        });

        if (propertyRepository.count() < 4) {
            if (!propertyRepository.existsById(1L)) {
                Property p1 = new Property();
                p1.setPropertyName("Luxury Villa");
                p1.setAddress("12, Beach Road, ECR");
                p1.setCity("Chennai");
                p1.setState("Tamil Nadu");
                p1.setZipCode("600041");
                p1.setPropertyType("Villa");
                p1.setCreatedBy(adminUser);
                propertyRepository.save(p1);
            }
            if (!propertyRepository.existsById(2L)) {
                Property p2 = new Property();
                p2.setPropertyName("Modern Apartment");
                p2.setAddress("405, Silicon Heights, Outer Ring Road");
                p2.setCity("Bangalore");
                p2.setState("Karnataka");
                p2.setZipCode("560103");
                p2.setPropertyType("Apartment");
                p2.setCreatedBy(adminUser);
                propertyRepository.save(p2);
            }
            if (!propertyRepository.existsById(3L)) {
                Property p3 = new Property();
                p3.setPropertyName("Independent House");
                p3.setAddress("88, Jubilee Hills, Road No. 36");
                p3.setCity("Hyderabad");
                p3.setState("Telangana");
                p3.setZipCode("500033");
                p3.setPropertyType("House");
                p3.setCreatedBy(adminUser);
                propertyRepository.save(p3);
            }
            if (!propertyRepository.existsById(4L)) {
                Property p4 = new Property();
                p4.setPropertyName("Premium Flat");
                p4.setAddress("102, Green Glen Layout, Bellandur");
                p4.setCity("Bangalore");
                p4.setState("Karnataka");
                p4.setZipCode("560103");
                p4.setPropertyType("Flat");
                p4.setCreatedBy(adminUser);
                propertyRepository.save(p4);
            }
        }
    }
}

