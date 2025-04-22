#include <iostream>
using namespace std;

int main() {
    float a, b;
    char op;

    cout << "Enter expression (e.g. 4 + 5): ";
    cin >> a >> op >> b;

    switch(op) {
        case '+': cout << "Result: " << a + b << endl; break;
        case '-': cout << "Result: " << a - b << endl; break;
        case '*': cout << "Result: " << a * b << endl; break;
        case '/':
            if (b != 0)
                cout << "Result: " << a / b << endl;
            else
                cout << "Division by zero!" << endl;
            break;
        default:
            cout << "Invalid operator!" << endl;
    }

    return 0;
}
