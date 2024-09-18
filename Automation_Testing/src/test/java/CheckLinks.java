import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;

import java.net.HttpURLConnection;
import java.net.URL;
import java.util.List;

public class CheckLinks {
    public static void main(String[] args) throws InterruptedException {

        WebDriver driver;
        driver = new ChromeDriver();
        driver.get("https://eticket.railway.gov.bd/");

        // Get all the links on the page
        List<WebElement> links = driver.findElements(By.tagName("a"));
        System.out.println("Total Link: "+links.size());

        // Loop through each link and check if it is valid
        for (WebElement link : links) {
            String url = link.getAttribute("href");

            if (url != null && !url.isEmpty()) {
                checkLink(url);  // Call the method to check the link
            } else {
                System.out.println("URL is either not configured or it is empty");
            }
        }

        Thread.sleep(10);
        driver.quit();
    }

    public static void checkLink(String urlLink) {
        try {
            URL url = new URL(urlLink);
            HttpURLConnection httpURLConnection = (HttpURLConnection) url.openConnection();
            httpURLConnection.setConnectTimeout(5000);  // Set timeout for the connection
            httpURLConnection.connect();

            if (httpURLConnection.getResponseCode() == 200) {
                System.out.println(urlLink + " - " + httpURLConnection.getResponseMessage());
            } else {
                System.out.println(urlLink + " - " + httpURLConnection.getResponseMessage() + " is a broken link.");
            }
        } catch (Exception e) {
            System.out.println(urlLink + " - Error: " + e.getMessage());
        }
    }
}
