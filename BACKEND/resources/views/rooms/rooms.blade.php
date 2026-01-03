
<!-- resources/views/home.blade.php -->
<!-- @extends('layouts.app') -->

@section('content')
    @include('header')
    <main style="flex: 1; padding: 20px; position: relative;">
        <section style="margin-bottom: 40px; display: flex; flex-direction: column; align-items: flex-start;">
            <h2 style="font-size: 29px; color: #1F2937; font-family: 'DM Sans'; font-weight: 500;">
                Search a room or share accommodation in your area
            </h2>
            <button
                style="padding: 16px 40px; background: #FFA41C; border-radius: 30px; font-size: 24px; font-family: 'DM Sans'; font-weight: 600; color: #1F2937; border: none; cursor: pointer;"
            >
                Find a Room
            </button>
        </section>
        <section style="margin-bottom: 40px; display: flex; flex-direction: column; align-items: flex-start;">
            <h2 style="font-size: 29px; color: #1F2937; font-family: 'DM Sans'; font-weight: 500;">
                Search for a roommate, share your home/room, and make money
            </h2>
            <button
                style="padding: 16px 40px; background: #FFA41C; border-radius: 30px; font-size: 24px; font-family: 'DM Sans'; font-weight: 600; color: #1F2937; border: none; cursor: pointer;"
            >
                Post an Add/Share My Room
            </button>
        </section>
        <section style="display: flex; justify-content: center;">
            <div style="width: 227px; background: #F5F5F5; padding: 20px; border-radius: 8px;">
                <img src="https://via.placeholder.com/80x80" alt="Profile" style="border-radius: 50%; margin-bottom: 10px;" />
                <h3 style="font-size: 18px; font-family: 'Rubik'; font-weight: 400; color: #545871;">Agency Dev</h3>
                <p style="font-size: 14px; font-family: 'Rubik'; font-weight: 400; color: #545871;">Indonesia</p>
            </div>
        </section>
    </main>
    @include('footer')
@endsection
