<?php

namespace Enjin\PlatformUi\Controllers;

use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Routing\Controller as BaseController;

class Controller extends BaseController
{
    use AuthorizesRequests;
    use ValidatesRequests;

    public function app(Request $request)
    {
        return view('platform-ui::app');
    }

    public function getResponseFromArrayable(Arrayable $arrayable): Response
    {
        return new Response($arrayable->toArray());
    }

    public function getErrorResponse(string $message, int $statusCode = Response::HTTP_BAD_REQUEST): Response
    {
        return new Response(['error' => $message], $statusCode);
    }
}
