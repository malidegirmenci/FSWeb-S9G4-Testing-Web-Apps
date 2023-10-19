import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import IletisimFormu from './IletisimFormu';

beforeEach(() => {
    render(<IletisimFormu />);
});

describe("İletişim Formu Testleri", () => {
    test('hata olmadan render ediliyor', () => {
        render(<IletisimFormu />);

    });

    test('iletişim formu headerı render ediliyor', () => {
        expect(screen.getByTestId("header"));
    });

    test('kullanıcı adını 5 karakterden az girdiğinde BİR hata mesajı render ediyor.', async () => {
        userEvent.type(screen.getByTestId("name"), "AYŞE");
        expect(screen.getByTestId("error"));
    });

    test('kullanıcı inputları doldurmadığında ÜÇ hata mesajı render ediliyor.', async () => {
        userEvent.click(screen.getByTestId("submit"));
        const allErrors = screen.getAllByTestId("error");
        expect(allErrors).toHaveLength(3);
    });

    test('kullanıcı doğru ad ve soyad girdiğinde ama email girmediğinde BİR hata mesajı render ediliyor.', async () => {
        userEvent.type(screen.getByTestId("name"), "AYŞEM");
        userEvent.type(screen.getByTestId("surname"), "GÜL AYŞEM GÜLDÜR AYŞEM");
        userEvent.type(screen.getByTestId("email"), "ayşeram.com");
        expect(screen.getByTestId("error"));
    });

    test('geçersiz bir mail girildiğinde "email geçerli bir email adresi olmalıdır." hata mesajı render ediliyor', async () => {
        userEvent.type(screen.getByTestId("email"), "ayşeram.com");
        expect(screen.getByTestId("error")).toHaveTextContent("email geçerli bir email adresi olmalıdır.");
    });

    test('soyad girilmeden gönderilirse "soyad gereklidir." mesajı render ediliyor', async () => {
        userEvent.click(screen.getByTestId("submit"));
        const allErrors = screen.getAllByTestId("error");
        expect(allErrors[1]).toHaveTextContent("soyad gereklidir.");
    });

    test('ad,soyad, email render ediliyor. mesaj bölümü doldurulmadığında hata mesajı render edilmiyor.', async () => {
        userEvent.type(screen.getByTestId("name"), "AYŞEM");
        userEvent.type(screen.getByTestId("surname"), "GÜL AYŞEM GÜLDÜR AYŞEM");
        userEvent.type(screen.getByTestId("email"), "ayseram@hotmail.com");

        await waitFor(() => {
            expect(screen.getByTestId('login-form')).toHaveFormValues({
                ad: 'AYŞEM',
                soyad: 'GÜL AYŞEM GÜLDÜR AYŞEM',
                email: 'ayseram@hotmail.com',
                mesaj: '',
            });
        });
        const submitBtn = screen.getByRole("button", { name: /Gönder/i });
        userEvent.click(submitBtn);

        await waitFor(() => {
            expect(screen.queryAllByTestId("error")).toHaveLength(0);
        });
    });

    test('form gönderildiğinde girilen tüm değerler render ediliyor.', async () => {
        const adInput = screen.getByLabelText("Ad*");
        userEvent.type(adInput, "abcde");
        const soyadInput = screen.getByPlaceholderText("Mansız");
        userEvent.type(soyadInput, "x");
        const emailInput = screen.getByPlaceholderText("yüzyılıngolcüsü@hotmail.com");
        userEvent.type(emailInput, "abcde@abcde.com");
        const mesajInput = screen.getByLabelText("Mesaj");
        userEvent.type(mesajInput, "abcde");

        const formElement = screen.getByTestId("login-form");

        await waitFor(() => {
            expect(formElement).toHaveFormValues({
                ad: "abcde",
                soyad: "x",
                email: "abcde@abcde.com",
                mesaj: "abcde",
            });
        });

        const submitBtn = screen.getByRole("button", { name: /Gönder/i });
        userEvent.click(submitBtn);

        await waitFor(() => {
            expect(screen.getByTestId("firstnameDisplay")).toHaveTextContent("abcde");
            expect(screen.getByTestId("lastnameDisplay")).toHaveTextContent("x");
            expect(screen.getByTestId("emailDisplay")).toHaveTextContent(
                "abcde@abcde.com"
            );
            expect(screen.getByTestId("messageDisplay")).toHaveTextContent("abcde");
        });
    });

});
