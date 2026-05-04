<?php

use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->trustProxies(
            at: env('TRUSTED_PROXIES', '127.0.0.1,::1'),
            headers: \Illuminate\Http\Request::HEADER_X_FORWARDED_FOR |
                \Illuminate\Http\Request::HEADER_X_FORWARDED_HOST |
                \Illuminate\Http\Request::HEADER_X_FORWARDED_PORT |
                \Illuminate\Http\Request::HEADER_X_FORWARDED_PROTO |
                \Illuminate\Http\Request::HEADER_X_FORWARDED_PREFIX |
                \Illuminate\Http\Request::HEADER_X_FORWARDED_AWS_ELB,
        );

        $middleware->encryptCookies(except: ['appearance', 'sidebar_state']);
        $middleware->redirectUsersTo('/');

        $middleware->web(append: [
            HandleAppearance::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->respond(function (Response $response) {
            $status = $response->getStatusCode();

            // Map status codes to error pages
            $errorPages = [
                400 => 'error/400',
                401 => 'error/401',
                403 => 'error/403',
                404 => 'error/404',
                500 => 'error/500',
                503 => 'error/503',
            ];

            // Check if this is an Inertia request and we have a custom error page
            if (
                request()->header('X-Inertia')
                && array_key_exists($status, $errorPages)
            ) {
                return Inertia::render($errorPages[$status], [
                    'status' => $status,
                ])
                    ->toResponse(request())
                    ->setStatusCode($status);
            }

            // For other 4xx and 5xx errors, use generic error pages
            if (request()->header('X-Inertia')) {
                if ($status >= 500 && $status < 600) {
                    return Inertia::render('error/500', [
                        'status' => $status,
                    ])
                        ->toResponse(request())
                        ->setStatusCode($status);
                }

                if ($status >= 400 && $status < 500 && $status !== 419) {
                    return Inertia::render('error/404', [
                        'status' => $status,
                    ])
                        ->toResponse(request())
                        ->setStatusCode($status);
                }
            }

            return $response;
        });
    })->create();
