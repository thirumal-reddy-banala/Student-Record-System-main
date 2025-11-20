// You are using GCC
#include <iostream>
#include <fstream>
#include <iomanip>
using namespace std;

#define MAX_STUDENTS 100

class Student {
public:
    int rollNo;
    string name;
    float maths, physics, chemistry;
    float total;
    float percentage;
    char grade;

    void addStudent();
    void calculateGrade();
    void saveToFile();
    static void viewAllStudents();
    static void searchStudent(int roll);
};

Student s[MAX_STUDENTS];
int scount = 0;

void Student::addStudent() {
    cout << "\nEnter Roll Number: ";
    cin >> s[scount].rollNo;
    cout << "Enter Name: ";
    cin.ignore();
    getline(cin, s[scount].name);

    cout << "Enter marks for Maths: ";
    cin >> s[scount].maths;
    cout << "Enter marks for Physics: ";
    cin >> s[scount].physics;
    cout << "Enter marks for Chemistry: ";
    cin >> s[scount].chemistry;

    s[scount].total = s[scount].maths + s[scount].physics + s[scount].chemistry;
    s[scount].percentage = s[scount].total / 3;
    s[scount].calculateGrade();
    s[scount].saveToFile();

    cout << "\nStudent record added successfully!\n";
    scount++;
}

void Student::calculateGrade() {
    if (percentage >= 90)
        grade = 'A';
    else if (percentage >= 75)
        grade = 'B';
    else if (percentage >= 60)
        grade = 'C';
    else if (percentage >= 40)
        grade = 'D';
    else
        grade = 'F';
}

void Student::saveToFile() {
    ofstream out("students.txt", ios::app);
    out << rollNo << " " << name << " "
        << maths << " " << physics << " " << chemistry << " "
        << total << " " << fixed << setprecision(2) << percentage << " " << grade << "\n";
    out.close();
}

void Student::viewAllStudents() {
    ifstream in("students.txt");
    if (!in) {
        cout << "No records found.\n";
        return;
    }

    cout << "\n--- Student Records ---\n";
    int roll;
    string name;
    float maths, physics, chemistry, total, percentage;
    char grade;

    while (in >> roll >> name >> maths >> physics >> chemistry >> total >> percentage >> grade) {
        cout << "\nRoll No: " << roll << "\n";
        cout << "Name: " << name << "\n";
        cout << "Marks: Maths: " << maths << ", Physics: " << physics << ", Chemistry: " << chemistry << "\n";
        cout << "Total: " << total << "\n";
        cout << "Percentage: " << fixed << setprecision(2) << percentage << "%\n";
        cout << "Grade: " << grade << "\n";
    }
    in.close();
}

void Student::searchStudent(int roll) {
    ifstream in("students.txt");
    if (!in) {
        cout << "No records found.\n";
        return;
    }

    int r;
    string n;
    float m, p, c, t, perc;
    char g;
    bool found = false;

    while (in >> r >> n >> m >> p >> c >> t >> perc >> g) {
        if (r == roll) {
            cout << "\nStudent Found:\n";
            cout << "Roll No: " << r << "\n";
            cout << "Name: " << n << "\n";
            cout << "Marks: Maths: " << m << ", Physics: " << p << ", Chemistry: " << c << "\n";
            cout << "Total: " << t << "\n";
            cout << "Percentage: " << fixed << setprecision(2) << perc << "%\n";
            cout << "Grade: " << g << "\n";
            found = true;
            break;
        }
    }

    if (!found)
        cout << "Student with roll number " << roll << " not found.\n";

    in.close();
}

int main() {
    int choice;
    Student s;

    cout << "**************\n";
    cout << "*     STUDENT REPORT CARD MANAGEMENT     *\n";
    cout << "**************\n";

    while (true) {
        cout << "\n----------- Main Menu -----------\n";
        cout << "1. Add Student\n";
        cout << "2. View All Students\n";
        cout << "3. Search Student\n";
        cout << "4. Exit\n";
        cout << "----------------------------------\n";

        cout << "Enter your choice: ";
        cin >> choice;

        switch (choice) {
            case 1: 
                s.addStudent(); 
                break;
            case 2: 
                Student::viewAllStudents(); 
                break;
            case 3:
                int roll;
                cout << "Enter Roll Number to search: ";
                cin >> roll;
                Student::searchStudent(roll);
                break;
            case 4:
                cout << "Exiting program...\n";
                return 0;
            default:
                cout << "Invalid choice. Try again.\n";
        }
    }

    return 0;
}