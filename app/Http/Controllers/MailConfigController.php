<?php
namespace App\Http\Controllers;

use App\Models\MailConfiguration;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MailConfigController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Payroll/MailConfig', [
            'configs' => MailConfiguration::latest()->get()->map(fn($c) => [
                'id' => $c->id,
                'name' => $c->name,
                'host' => $c->host,
                'port' => $c->port,
                'username' => $c->username,
                'encryption' => $c->encryption,
                'from_address' => $c->from_address,
                'from_name' => $c->from_name,
                'is_active' => $c->is_active,
            ]),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:100',
            'host' => 'required|string',
            'port' => 'required|integer',
            'username' => 'required|string',
            'password' => 'required|string',
            'encryption' => 'required|in:tls,ssl',
            'from_address' => 'required|email',
            'from_name' => 'required|string',
        ]);

        MailConfiguration::create($request->all());
        return back()->with('success', 'Konfigurasi berhasil ditambahkan.');
    }

    public function update(Request $request, MailConfiguration $mailConfiguration)
    {
        $data = $request->validate([
            'name' => 'required|string|max:100',
            'host' => 'required|string',
            'port' => 'required|integer',
            'username' => 'required|string',
            'encryption' => 'required|in:tls,ssl',
            'from_address' => 'required|email',
            'from_name' => 'required|string',
        ]);

        // Password hanya diupdate kalau diisi
        if ($request->filled('password')) {
            $data['password'] = $request->password;
        }

        $mailConfiguration->update($data);
        return back()->with('success', 'Konfigurasi berhasil diupdate.');
    }

    public function destroy(MailConfiguration $mailConfiguration)
    {
        $mailConfiguration->delete();
        return back()->with('success', 'Konfigurasi dihapus.');
    }

    public function setActive(MailConfiguration $mailConfiguration)
    {
        MailConfiguration::query()->update(['is_active' => false]);
        $mailConfiguration->update(['is_active' => true]);
        return back()->with('success', "{$mailConfiguration->name} sekarang aktif.");
    }

    public function testSend(Request $request, MailConfiguration $mailConfiguration)
    {
        $request->validate(['to' => 'required|email']);
        MailConfiguration::applyToMailer($mailConfiguration);

        try {
            \Mail::raw("Test email dari konfigurasi: {$mailConfiguration->name}", function ($msg) use ($request, $mailConfiguration) {
                $msg->to($request->to)
                    ->subject("Test SMTP - {$mailConfiguration->name}");
            });

            return back()->with('success', "Test email terkirim ke {$request->to}");
        } catch (\Exception $e) {
            return back()->with('error', "Gagal mengirim email: " . $e->getMessage());
        }
    }
}
