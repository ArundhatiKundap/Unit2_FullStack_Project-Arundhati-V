package TradeTrail.backend.models;
import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "Trader_Details")
public class TraderInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String name;

    @Column(unique = true)
    private String email;

    private String password;

    private boolean isPremium;

    private String role;

    // ----- Constructors -----
    public TraderInfo() {
    }

    public TraderInfo(int id, String name, String email, String password, boolean isPremium, String role) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.isPremium = isPremium;
        this.role = role;
    }

    // ----- Getters and Setters -----
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public boolean isPremium() {
        return isPremium;
    }

    public void setPremium(boolean premium) {
        isPremium = premium;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

}
