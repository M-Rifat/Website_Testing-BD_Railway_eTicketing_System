import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.testng.Assert;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;

import java.time.Duration;

public class Testing2Test {

    WebDriver driver;

    @BeforeClass
    public void setup() {
        driver = new ChromeDriver();
    }

    @Test(priority = 1)
    public void openBrowser() throws InterruptedException {
        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
        driver.get("https://eticket.railway.gov.bd/");
        Thread.sleep(2000);
        driver.findElement(By.className("agree-btn")).click();
    }

    @DataProvider(name = "loginData")
    public Object[][] getData() {
        return new Object[][]{
                {"01725028362", "password1"},
                {"01725028362", "password2"},
                {"01725028366", "validPassword"}
        };
    }

    @Test(priority = 2)
    public void checkLogin(){
        // Open the login page
        WebElement loginOpt = driver.findElement(By.cssSelector("a[title='Login']"));
        if (loginOpt.isDisplayed()) {
            loginOpt.click();
        }
    }

    @Test(priority = 3, dataProvider = "loginData")
    public void login(String num, String pass) throws InterruptedException {

        // Enter phone number and password
        WebElement phoneNumberField = driver.findElement(By.xpath("//input[@id='mobile_number']"));
        WebElement passwordField = driver.findElement(By.xpath("//input[@id='password']"));

        phoneNumberField.clear();
        phoneNumberField.sendKeys(num);
        passwordField.clear();
        passwordField.sendKeys(pass);

        // Submit the login button
        driver.findElement(By.xpath("//button[@type='submit']")).click();

        // Wait for the page to load and check for login success if the correct password is used
        Thread.sleep(2000);
        if ("validPassword".equals(pass)) {
            WebElement profileElement = driver.findElement(By.xpath("//span[contains(text(),'MD. MOBINUL ISLAM')]"));
            Assert.assertTrue(profileElement.isDisplayed(), "Login failed for Rider#41R.");
        }
    }

    @Test(priority = 4, dependsOnMethods = "login")
    public void myProfile() throws InterruptedException {
        Thread.sleep(2000);
        WebElement profileMenu = driver.findElement(By.xpath("//span[contains(text(),'MD. MOBINUL ISLAM')]"));
        profileMenu.click();
        driver.findElement(By.xpath("//span[normalize-space()='Profile']")).click();
    }

    @Test(priority = 5, dependsOnMethods = "login")
    public void purchaseHistory() throws InterruptedException {
        Thread.sleep(2000);
        WebElement profileMenu = driver.findElement(By.xpath("//span[contains(text(),'MD. MOBINUL ISLAM')]"));
        profileMenu.click();
        driver.findElement(By.xpath("//span[normalize-space()='Purchase History']")).click();
    }

    @AfterClass
    public void tearDown() throws InterruptedException {
        if (driver != null) {
            Thread.sleep(9000);
            driver.quit();
        }
    }
}
