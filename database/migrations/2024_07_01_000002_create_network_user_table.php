<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateNetworkUserTable extends Migration
{
    public function up()
    {
        Schema::create('network_user', function (Blueprint $table) {
            $table->id();
            $table->foreignId('network_id')->constrained();
            $table->foreignId('user_id')->constrained();
            $table->timestamps();

            $table->unique(['network_id', 'user_id']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('network_user');
    }
}
